# Batty

![Roy Batty](http://i.imgur.com/NLDOQRE.jpg)

Batty is a tool to test implementations of the Threepio API.

## Installation

    $ [sudo] npm install -g batty

## Usage

To test a Threepio implementation, first set your framework up such that the following is
true:

- The MCP has a command, called "echo", that takes one argument and returns it.
- There is one Robot, named 'TestBot'. It has the following properties:
    - One 'loopback' connection.
    - One 'ping' device.
    - A 'hello' command, that takes one argument and interpolates the result
      into a string. e.g. `hello("world") == "Hello, world!"`

Then, when the API is started up, run the `batty` command, pointing it to the
root API path. e.g.

    $ node robot.js
      [...]
      I, [2014-07-10T21:41:36.309Z]  INFO -- : Working.
      I, [2014-07-10T21:41:36.313Z]  INFO -- : Cylon API Server is now online.
      I, [2014-07-10T21:41:36.313Z]  INFO -- : Listening at http://127.0.0.1:3000

    # in another shell
    $ batty http://127.0.0.01:3000

Batty will then poke and prod at the API, and test to make sure it meets the
Threepio spec.

Here's an example implementation of the test robot with
[Cylon](http://cylonjs.com):

```javascript
var Cylon = require('cylon');

Cylon.api({
  ssl: false
});

Cylon.commands.echo = function(arg) {
  if (arg == null) {
    throw new Error("No value passed to echo");
  }

  return arg;
};

Cylon.robot({
  name: "TestBot",

  connections: {
    loopback: { adaptor: 'loopback', port: '/dev/null', test: 'abc' }
  },

  devices: {
    ping: { driver: 'ping', pin: '13', test: 'abc' }
  },

  commands: function() {
    return {
      hello: this.hello
    }
  },

  events: [ "hello" ],

  work: function(my) {
    every((5).seconds(), my.ping.ping);
  },

  hello: function(str) {
    this.emit("hello");
    return "Hello, " + str + "!";
  }
});

Cylon.start();
```

And here is an example implementation with [Gobot](http://gobot.io):

```go
package main

import (
	"fmt"

	"github.com/hybridgroup/gobot"
	"github.com/hybridgroup/gobot/api"
)

func main() {
	gbot := gobot.NewGobot()

	api.NewAPI(gbot).Start()

	gbot.AddCommand("echo", func(params map[string]interface{}) interface{} {
		return params["a"]
	})

	loopback := gobot.NewLoopbackAdaptor("loopback")
	ping := gobot.NewPingDriver(loopback, "ping")
	r := gobot.NewRobot("TestBot",
		[]gobot.Connection{loopback},
		[]gobot.Device{ping},
	)

	r.AddCommand("hello", func(params map[string]interface{}) interface{} {
		return fmt.Sprintf("Hello, %v!", params["greeting"])
	})

	gbot.AddRobot(r)
	gbot.Start()
}
```

## Caveats

If you attempt to run Batty against an API server with a self-signed SSL cert,
the event tests will fail, as EventSource cannot verify the cert before
connecting.

## Version History

- 0.1.0 - Initial release.

## License

Apache 2.0. For more details, see `LICENSE` file.
