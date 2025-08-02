#!/bin/bash
OSPREY_INSTALL=${OSPREY_INSTALL:-"${HOME}"}
. "${OSPREY_INSTALL}/osprey.sh"

SKYNET_VERSION="0.0.1"

DMR_BASE_URL=${MODEL_RUNNER_BASE_URL:-http://localhost:12434/engines/llama.cpp/v1}
MODEL=${MODEL_RUNNER_TOOL_MODEL:-"ai/qwen2.5:latest"}
TEMPERATURE=${MODEL_RUNNER_TEMPERATURE:-"0.0"}
MODEL_RUNNER_PULL=${MODEL_RUNNER_PULL:-"true"}

read -r -d '' DEFAULT_SYSTEM_INSTRUCTION <<- EOM
You are a robot.
You have tools that actually call devices in the physical world that you are connected to.
Use your tools to respond to human requests.
Keep your responses short and to the point.
EOM

SYSTEM_INSTRUCTION=${SYSTEM_INSTRUCTION:-"${DEFAULT_SYSTEM_INSTRUCTION}"}

MCP_SERVER=${MCP_SERVER:-"http://localhost:9090"}

DEBUG_MODE=false
if [ "$1" = "-d" ] || [ "$1" = "--debug" ]; then
  DEBUG_MODE=true
fi

clear

echo "███████╗██╗  ██╗██╗   ██╗███╗   ██╗███████╗████████╗";
echo "██╔════╝██║ ██╔╝╚██╗ ██╔╝████╗  ██║██╔════╝╚══██╔══╝";
echo "███████╗█████╔╝  ╚████╔╝ ██╔██╗ ██║█████╗     ██║   ";
echo "╚════██║██╔═██╗   ╚██╔╝  ██║╚██╗██║██╔══╝     ██║   ";
echo "███████║██║  ██╗   ██║   ██║ ╚████║███████╗   ██║   ";
echo "╚══════╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═══╝╚══════╝   ╚═╝   ";
echo "                                                    ";

echo "🔺 Skynet version $SKYNET_VERSION"
echo "🧠 loading model ${MODEL}"

if [[ "$MODEL_RUNNER_PULL" == "true" ]]; then
  docker model pull ${MODEL}
fi

echo ""

# Allow multiple MCP_SERVER addresses separated by comma
MCP_SERVERS=${MCP_SERVER:-"http://localhost:9090"}
IFS=',' read -ra SERVER_ARRAY <<< "$MCP_SERVERS"

COMBINED_TOOLS="[]"

# Build a map of function name to MCP server
declare -A FUNCTION_SERVER_MAP
for SERVER in "${SERVER_ARRAY[@]}"; do
  TOOLS_JSON=$(get_mcp_http_tools "$SERVER")
  if [[ -z "$TOOLS_JSON" || "$TOOLS_JSON" == "null" ]]; then
    continue
  fi

  # For each tool, map its function name to the server
  FUNCTION_NAMES=$(echo "$TOOLS_JSON" | jq -r '.[].name')
  for fname in $FUNCTION_NAMES; do
    FUNCTION_SERVER_MAP["$fname"]="$SERVER"
  done
  # Combine JSON arrays using jq
  COMBINED_TOOLS=$(jq -s 'add' <(echo "$COMBINED_TOOLS") <(echo "$TOOLS_JSON"))
done

if [[ "$COMBINED_TOOLS" == "[]" ]]; then
    echo "🔴 no MCP servers. Exiting..."
    exit 1
fi

TOOLS=$(transform_to_openai_format "$COMBINED_TOOLS")
if [[ -z "$TOOLS" ]]; then
    echo "🔴 no MCP server tools found. Exiting..."
    exit 1
fi

if [[ "$DEBUG_MODE" == "true" ]]; then
  echo "---------------------------------------------------------"
  echo "Available tools:"
  echo "${TOOLS}" 
  echo "---------------------------------------------------------"
fi

# needed to handle the ASSISTANT_RESPONSE being created from a subprocess.
shopt -s lastpipe

# Initialize conversation history array
CONVERSATION_HISTORY=()
ASSISTANT_RESPONSE=""

while true; do
  STOPPED="false"
  TOOLS_CALLED="false"
  USER_CONTENT=$(gum write --placeholder "🎤 Skynet ready. Enter command (/bye to exit).")
  
  if [[ "$USER_CONTENT" == "/bye" ]]; then
    echo "Goodbye!"
    break
  fi

  echo "💬 ${USER_CONTENT}"
  echo ""

  # Add user message to conversation history
  add_user_message CONVERSATION_HISTORY "${USER_CONTENT}"

  while [ "$STOPPED" != "true" ]; do
    # Build messages array conversation history
    MESSAGES=$(build_messages_array CONVERSATION_HISTORY)

    read -r -d '' DATA <<- EOM
{
  "model": "${MODEL}",
  "options": {
    "temperature": ${TEMPERATURE}
  },
  "messages": [${MESSAGES}],
  "tools": ${TOOLS},
  "parallel_tool_calls": false,
  "tool_choice": "auto"
}
EOM

    RESULT=$(osprey_tool_calls ${DMR_BASE_URL} "${DATA}")

    if [[ "$DEBUG_MODE" == "true" ]]; then
      echo "📝 raw JSON response:"
      print_raw_response "${RESULT}"
    fi

    FINISH_REASON=$(get_finish_reason "${RESULT}")
    case $FINISH_REASON in
      tool_calls)
        TOOLS_CALLED="true"
        # Get tool calls for further processing
        TOOL_CALLS=$(get_tool_calls "${RESULT}")

        if [[ -n "$TOOL_CALLS" ]]; then
            add_tool_calls_message CONVERSATION_HISTORY "${TOOL_CALLS}"

            for tool_call in $TOOL_CALLS; do
                FUNCTION_NAME=$(get_function_name "$tool_call")
                FUNCTION_ARGS=$(get_function_args "$tool_call")
                CALL_ID=$(get_call_id "$tool_call")

                # Find the correct MCP server for this function
                SERVER_TO_USE="${FUNCTION_SERVER_MAP[$FUNCTION_NAME]}"
                if [[ -z "$SERVER_TO_USE" ]]; then
                  SERVER_TO_USE="$MCP_SERVER" # fallback
                fi

                echo "🛠️ calling tool '$FUNCTION_NAME' on $SERVER_TO_USE with $FUNCTION_ARGS"

                # Execute function via MCP
                MCP_RESPONSE=$(call_mcp_http_tool "$SERVER_TO_USE" "$FUNCTION_NAME" "$FUNCTION_ARGS")
                RESULT_CONTENT=$(get_tool_content_http "$MCP_RESPONSE")

                echo "✅ result $RESULT_CONTENT"

                TOOL_RESULT=$(echo "${RESULT_CONTENT}" | jq -r '.content')
                add_tool_message CONVERSATION_HISTORY "${CALL_ID}" "${TOOL_RESULT}"
            done
        else
          if [[ "$DEBUG_MODE" == "true" ]]; then
            echo "🔵 no tool calls found in response"
          fi
        fi
        ;;

      stop)
        STOPPED="true"
        ASSISTANT_MESSAGE=$(echo "${RESULT}" | jq -r '.choices[0].message.content')

        if [[ "$TOOLS_CALLED" == "true" ]]; then
          echo ""
        fi

        echo "🤖 ${ASSISTANT_MESSAGE}"

        # Add assistant response to conversation history (from callback)
        add_assistant_message CONVERSATION_HISTORY "${ASSISTANT_MESSAGE}"
        ;;

      *)
        echo "🔴 unexpected model response: $FINISH_REASON"
        ;;
    esac

  done
  echo ""
done
