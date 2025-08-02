# Skynet

## 🔺 What is Skynet

Skynet is a lightweight command line interface to Large Language Models for control of real robots using Bash.

It provides an [MCP host](https://modelcontextprotocol.io/docs/learn/architecture) that calls [Docker Model Runner](https://www.docker.com/products/model-runner/) to control robots, drones, and other physical devices that provide an [MCP server](https://modelcontextprotocol.io/docs/learn/server-concepts) interface.  See [ROBOTS.md](ROBOTS.md) for a list of devices with MCP servers.

Skynet supports multiple step interactions for models such as [Qwen 2.5 Instruct](https://hub.docker.com/r/ai/qwen2.5). See [MODELS.md](MODELS.md) for a list of models that are known to support multistep actions.

![MCP interactive](./images/skynet-example.png)

## 🔺 How Skynet works

Skynet is written in [bash](https://en.wikipedia.org/wiki/Bash_(Unix_shell)) using [Osprey](https://github.com/k33g/osprey).

### Architecture

```mermaid
flowchart TD
subgraph Skynet
    A(["Chat interface"])
    A <---> C["Chat completions"]
    A <---> T["Tool calls"]
    C <--> T
end
subgraph "Docker Model Runner"
  M["Qwen 2.5"]
end
subgraph "MCP Server 1"
  D["Drone"]
end
subgraph "MCP Server 2"
  R["Robot"]
end
C <-- http --> M
T <-- http --> D
T <-- http --> R
```

### User flow

```mermaid
sequenceDiagram
        actor Human
        actor Skynet
        actor Model
        actor MCP Server
        actor Robot
        loop entering commands
            Human->>Skynet: type command
            Skynet->>Model: send message
            Model->>Skynet: send response
            loop while tool calls needed
                Skynet->>MCP Server: call tool
                MCP Server-->>Robot: call device API
                Robot-->>MCP Server: device API result
                MCP Server->>Skynet: send results from tool
                Skynet->>Skynet: add results to message history
                Skynet->>Model: send updated message
                Model->>Skynet: send response
            end
            break no tool calls needed
                Skynet->>Human: display result
            end
        end
```

## 🔺 Using Skynet

You must have any robot MCP servers already running in order to run Skynet. See [ROBOTS.md](ROBOTS.md) for a list of some known physical devices with MCP server interfaces.

Then just run the `skynet.sh` command.

### Additional command options

You can set the following environment variables to change Skynet.

🔺 `DEBUG_MODE`

Set debug mode. Defaults to `false`

🔺 `MCP_SERVER`

Set the MCP server to use. Defaults to `http://localhost:9090`

🔺 `MODEL_RUNNER_BASE_URL`

Set the URL to call Docker Model Runner.

🔺 `MODEL_RUNNER_PULL`

Should Docker Model Runner pull the latest model? Defaults to `true`

🔺 `MODEL_RUNNER_TOOL_MODEL`

Set the model to use. Defaults to `ai/qwen2.5:latest`

🔺 `MODEL_RUNNER_TEMPERATURE`

Set the temperature for the model. Defaults to `0.0`

🔺 `OSPREY_INSTALL`

Set the directory in which to find Osprey. Defaults to your home directory.

🔺 `SYSTEM_INSTRUCTION`

Set the system instruction. Defaults to:

```
You are a robot.
You have tools that actually call devices in the physical world that you are connected to.
Use your tools to respond to human requests.
Keep your responses short and to the point.
```

## 🔺 Installing Skynet

You can use Skynet with the [Docker Model Runner](https://www.docker.com/products/model-runner/) with any model that supports instructions.

See [MODELS.md](MODELS.md) for a list of models that are known to support multistep actions.

You also need to install the following:

🔺 jq - A lightweight and flexible command-line JSON processor.

🔺 awk - A domain-specific language designed for text processing.

🔺 curl - A command-line tool for transferring data with URLs.

🔺 bash - A Unix shell and command language.

🔺 [gum](https://github.com/charmbracelet/gum) - A tool for creating interactive command-line applications.

🔺 [osprey](https://github.com/k33g/osprey) - A lightweight Bash library for interacting with the DMR (Docker Model Runner) API.
