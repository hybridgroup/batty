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
      response: { hello: "world" }
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


  describe("#success", function() {
    var req;

    beforeEach(function() {
      req = new Request(base, route);
    });

    context("if the returned data matches expectations", function() {
      beforeEach(function() {
        res.emit("success", { hello: 'world' });
      });

      it("logs success", function() {
        expect(console.log).to.be.calledWith(route.path + " PASSED".green);
      });
    });

    context("if the returned data does not match", function() {
      beforeEach(function() {
        res.emit("success", { goodbye: 'world' });
      });

      it("logs failure", function() {
        expect(console.log).to.be.calledWith(route.path + " FAILED".red);
      });

      it("prints the diff", function() {
        var diff = '{"'.grey;
        diff += "goodby".green;
        diff += "h".red;
        diff += "e".grey;
        diff += "llo".red;
        diff += '":"world"}'.grey;
        diff += "\n";

        expect(printString).to.eql(diff);
      });
    });
  });

  describe("#fail", function() {
    var req;

    beforeEach(function() {
      req = new Request(base, route);
      res.emit("fail", "An error occured");
    });

    it("logs that an error occured", function() {
      expect(console.log).to.be.calledWith(route.path + " FAILED".red);
      expect(console.log).to.be.calledWith("An error occured");
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
