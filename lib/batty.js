"use strict";

var routes = require('./routes');

var rest = require('restler'),
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

    req.on('complete', function() {
      console.log();
    });

    req.on('success', function(data, response) {
      var correct = _.isEqual(route.response, data);

      if (correct) {
        return console.log(path + " PASSED");
      }

      console.log(path + " FAILED");
      printDiff(route.response, data);
    });

    req.on('fail', function(data, response) {
      console.log(path + " FAILED");
      console.log(data.replace("\n", ""));
    });

    req.on('error', function(err) {
      console.log(path + " ERROR - " + err.code);
    });
  });
};

var printHelp = function() {
  console.log("Usage example:");
  console.log("  batty https://localhost:3000/");
};

var printDiff = function(a, b) {
  var expected = JSON.stringify(a);
  var actual = JSON.stringify(b);

  console.log("EXPECTED: " + expected);
  console.log("ACTUAL  : " + actual);
};
