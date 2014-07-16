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

  this.request.on('success', this.success.bind(this));
  this.request.on('fail', this.fail.bind(this));
  this.request.on('error', this.error.bind(this));

  this.request.on('complete', function() {
    callback();
  });
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

  var diff = jsdiff.diffChars(expected, actual);

  diff.forEach(function(part) {
    var color;

    if (part.added) {
      color = 'green';
    }

    if (part.removed) {
      color = 'red';
    }

    color = color || 'grey'

    util.print(part.value[color]);
  });

  util.print("\n");
};

Request.prototype.success = function(data, res) {
  var correct = _.isEqual(this.route.response, data);

  if (correct) {
    return console.log(this.route.path + " PASSED".green);
  }

  console.log(this.route.path + " FAILED".red);
  this.printDiff(this.route.response, data);
};

Request.prototype.fail = function(data, res) {
  console.log(this.route.path + " FAILED".red);
  console.log(data.replace("\n", ""));
};

Request.prototype.error = function(err, res) {
  console.log(this.route.path + " ERROR - ".red + err.code.red);
};
