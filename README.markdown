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

## License

Apache 2.0. For more details, see `LICENSE` file.
