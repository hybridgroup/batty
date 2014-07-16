"use strict";

var util = require('util');

require('colors');

var routes = require('./routes');

var rest = require('restler'),
    jsdiff = require('diff'),
    _ = require('lodash');

module.exports = function Batty(base) {
  if (!base) {
    console.log("No base URL supplied");
    printHelp();
    return;
  }

  Object.keys(routes).forEach(function(path) {
    var route = routes[path];

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

    var req = rest[route.method](base + path, opts);

    req.on('success',  success(path, route));
    req.on('fail',     fail(path, route));
    req.on('error',    error(path, route));
    req.on('complete', complete(path, route));
  });
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

var success = function(path, route) {
  return function(data, response) {
    var correct = _.isEqual(route.response, data);

    if (correct) {
      return console.log(path + " PASSED".green);
    }

    console.log(path + " FAILED".red);
    printDiff(route.response, data);
  };
};

var fail = function(path, route) {
  return function(data, response) {
    console.log(path + " FAILED".red);
    console.log(data.replace("\n", ""));
  };
};

var error = function(path, route) {
  return function(data, response) {
    console.log(path + " ERROR - ".red + err.code.red);
  };
};

var complete = function(path, route) {
  return function(data, response) {
    console.log();
  };
};
