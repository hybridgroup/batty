# Batty

Batty is a command line interface and [MCP host](https://modelcontextprotocol.io/docs/learn/architecture) to interact with LLMs to command real robots, drones, and other devices that provide an [MCP server](https://modelcontextprotocol.io/docs/learn/server-concepts) interface.

Supports multiple step interactions for models that can perform such actions.

![MCP interactive](./images/batty-example.png)

Written using [Osprey](https://github.com/k33g/osprey) on [bash](https://en.wikipedia.org/wiki/Bash_(Unix_shell)).

## How it works

### Architecture

```mermaid
flowchart TD
subgraph Batty
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
        actor Batty
        actor Model
        actor MCP Server
        actor Robot
        loop entering commands
            Human->>Batty: types command
            Batty->>Model: enters command
            Model->>Batty: response
            loop while tool calls needed
                Batty->>MCP Server: call tools
                MCP Server->>Robot: call API
                Robot->>MCP Server: API result
                MCP Server->>Batty: results from tools
                Batty->>Model: add results from tools to message history
                Model->>Batty: response
            end
            break no tool calls needed
                Batty->>Human: display result
            end
        end
```


## Using

You must have any robot MCP servers already running in order to run Batty.

Then just run the `batty.sh` command.

### Additional command options

Coming soon...

## Installing

You can use Batty with the [Docker Model Runner](https://www.docker.com/products/model-runner/) with any model that supports instructions.

[Qwen 2.5 Instruct](https://hub.docker.com/r/ai/qwen2.5) is known to work. Others may as well...

- jq - A lightweight and flexible command-line JSON processor.
- awk - A domain-specific language designed for text processing.
- curl - A command-line tool for transferring data with URLs.
- bash - A Unix shell and command language.
- gum - A tool for creating interactive command-line applications.
- osprey - A lightweight Bash library for interacting with the DMR (Docker Model Runner) API.
