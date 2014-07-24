# Batty

![Roy Batty](http://i.imgur.com/NLDOQRE.jpg)

Batty is a tool to test implementations of the Threepio API.

## Installation

    $ npm install batty

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
      I, [2014-07-10T21:41:36.313Z]  INFO -- : Listening at https://127.0.0.1:3000

    # in another shell
    $ batty https://127.0.0.01:3000

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
  return arg;
};

Cylon.robot({
  name: "TestBot",

  connection: { name: 'loopback', adaptor: 'loopback' },
  device: { name: 'ping', driver: 'ping' },

  commands: [ 'hello' ],

  work: function(my) {
    every((5).seconds(), my.ping.ping);
  },

  hello: function(str) {
    return "Hello, " + str + "!";
  }
});

Cylon.start();
```

## Caveats

If you attempt to run Batty against an API server with a self-signed SSL cert,
the event tests will fail, as EventSource cannot verify the cert before
connecting.

## Version History

- 0.1.0 - Initial release.

## License

Apache 2.0. For more details, see `LICENSE` file.
