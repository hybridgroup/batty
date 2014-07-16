"use strict";

var util = require('util');

require('colors');

var routes = require('./routes');

var rest = require('restler'),
    jsdiff = require('diff'),
    async = require('async'),
    _ = require('lodash');

module.exports = function Batty(base) {
  if (!base) {
    console.log("No base URL supplied");
    printHelp();
    return;
  }

  var test = function(route, callback) {
    var opts = {
      headers: {
        Accept: "application/vnd.threepio.v1+json",
        'User-Agent': "Batty"
      },

      rejectUnauthorized: false
    }

    if (route.body) {
      opts.data = JSON.stringify(route.body);
      opts.headers["Content-Type"] = "application/json";
    }

    var req = rest[route.method](base + route.path, opts);

    req.on('success',  success(route));
    req.on('fail',     fail(route));
    req.on('error',    error(route));
    req.on('complete', function() { callback(); });
  };

  async.mapSeries(routes, test);
};

var printHelp = function() {
  console.log("Usage example:");
  console.log("  batty https://localhost:3000/");
};

var printDiff = function(a, b) {
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

var success = function(route) {
  return function(data, response) {
    var correct = _.isEqual(route.response, data);

    if (correct) {
      return console.log(route.path + " PASSED".green);
    }

    console.log(route.path + " FAILED".red);
    printDiff(route.response, data);
  };
};

var fail = function(route) {
  return function(data, response) {
    console.log(route.path + " FAILED".red);
    console.log(data.replace("\n", ""));
  };
};

var error = function(route) {
  return function(data, response) {
    console.log(route.path + " ERROR - ".red + err.code.red);
  };
};
