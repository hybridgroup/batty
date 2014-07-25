"use strict";

var EventEmitter = require('events').EventEmitter,
    util = require('util');

var rest = require('restler');

var Request = source('request');

describe("Request", function() {
  var base, route, res;

  var printString, originalPrint;

  beforeEach(function() {
    base = "http://localhost";

    route = {
      path: "/hello",
      method: "get",
      response: [200, { hello: "world" }]
    };

    printString = "";

    res = new EventEmitter();

    stub(console, 'log');

    originalPrint = util.print;

    util.print = function(str) {
      printString += str;
    }

    stub(rest, 'get').returns(res);
    stub(rest, 'post').returns(res);
  });

  afterEach(function() {
    console.log.restore();
    util.print = originalPrint;

    rest.get.restore();
    rest.post.restore();
  });

  it("makes a request to to the provided route", function() {
    var req = new Request(base, route);
    var opts = {
      headers: {
        "Accept": "application/vnd.threepio.v1+json",
        "User-Agent": "Batty",
        "Content-Type": "application/json"
      },

      rejectUnauthorized: false
    }

    expect(rest.get).to.be.calledWith(base + route.path, opts);
  });

  it("can make POST requests", function() {
    route.body = { greeting: 'hello' };
    route.method = 'post';

    var req = new Request(base, route);
    var opts = {
      headers: {
        "Accept": "application/vnd.threepio.v1+json",
        "User-Agent": "Batty",
        "Content-Type": "application/json"
      },

      data: '{"greeting":"hello"}',

      rejectUnauthorized: false
    }

    expect(rest.post).to.be.calledWith(base + route.path, opts);
  });


  describe("#complete", function() {
    var req, callback;

    beforeEach(function() {
      callback = spy();
      req = new Request(base, route, callback);
    });

    context("if the status code doesn't match expectations", function() {
      beforeEach(function() {
        req.expectedCode = 200;
        res.statusCode = 404;
        res.emit('complete', "Not Found", res);
      });

      it("logs that they didn't match", function() {
        var expected = "expected status code 200, received 404";
        expect(console.log).to.be.calledWith("/hello" + " FAILED".red);
        expect(console.log).to.be.calledWith(expected);
      });

      it("triggers the callback", function() {
        expect(callback).to.be.called;
      })
    });

    context("if the status code matches", function() {
      beforeEach(function() {
        req.expectedCode = 200;
        res.statusCode = 200;
      });

      context("if the body doesn't match expectations", function() {
        beforeEach(function() {
          req.printDiff = spy();
          res.emit('complete', { random: "thing" }, res);
        });

        it("prints the diff", function() {
          expect(req.printDiff).to.be.calledWith(route.response[1], { random: "thing" });
        });

        it("triggers the callback", function() {
          expect(callback).to.be.called;
        });
      });

      context("if the body match expectations", function() {
        beforeEach(function() {
          stub(req, 'printDiff');
          res.emit('complete', { hello: "world" }, res);
        });

        it("logs success", function() {
          expect(console.log).to.be.calledWith("/hello" + " PASSED".green);
        });

        it("triggers the callback", function() {
          expect(callback).to.be.called;
        });
      });
    });
  });

  describe("#error", function() {
    var req;

    beforeEach(function() {
      req = new Request(base, route);
      res.emit("error", { code: "E_TEST" });
    });

    it("logs that an error occured", function() {
      var str = route.path + " ERROR - ".red + "E_TEST".red
      expect(console.log).to.be.calledWith(str);
    });
  });
});
