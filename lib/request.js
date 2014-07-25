"use strict";

var util = require('util');

require("colors");

var rest = require("restler"),
    jsdiff = require("diff"),
    _ = require("lodash");

var Request = module.exports = function Request(base, route, callback) {
  var opts = _.cloneDeep(this.opts);

  if (route.body) {
    opts.data = JSON.stringify(route.body);
  }

  var uri = base + route.path;

  this.callback = callback;
  this.route = route;
  this.request = rest[route.method](uri, opts);

  this.expectedCode = route.response[0];
  this.expectedResponse = route.response[1];

  this.request.on('error', this.error.bind(this));
  this.request.on('complete', this.complete.bind(this));
};

Request.prototype.opts = {
  headers: {
    "Accept": "application/vnd.threepio.v1+json",
    "User-Agent": "Batty",
    "Content-Type": "application/json"
  },

  rejectUnauthorized: false
};

Request.prototype.printDiff = function(a, b) {
  var expected = JSON.stringify(a);
  var actual = JSON.stringify(b);

  console.log("expected: " + expected);
  console.log("actual:   " + actual);
};

Request.prototype.complete = function(data, res) {
  var correct = _.isEqual(this.expectedResponse, data);

  if (res.statusCode !== this.expectedCode) {
    console.log(this.route.path + " FAILED".red);
    console.log("expected status code " + this.expectedCode + ", received " + res.statusCode);
    return this.callback();
  };

  if (!correct) {
    console.log(this.route.path + " FAILED".red);
    this.printDiff(this.expectedResponse, data);
    return this.callback();
  };

  console.log(this.route.path + " PASSED".green);
  this.callback();
};

Request.prototype.error = function(err, res) {
  console.log(this.route.path + " ERROR - ".red + err.code.red);
};
