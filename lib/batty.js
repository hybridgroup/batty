'use strict';

var path = require('path'),
    util = require('util');

var Routes = require('./routes');

var rest = require('restler'),
    _ = require('lodash');

module.exports = function Batty(base) {
  if (!base) {
    console.log("No base URL supplied");
    printHelp();
    return;
  }

  Object.keys(Routes).forEach(function(path) {
    var route = Routes[path];
    var req = rest.get(base + path);

    req.on('complete', function() {
      console.log();
    })

    req.on('success', function(data, response) {

      if (_.isEqual(route.response, data)) {
        return console.log(path + " PASSED");
      }

      console.log(path + " FAILED");
      printDiff(route.response, data);
    });

    req.on('fail', function(data, response) {
      console.log(path + " FAILED");
      console.log(data.replace("\n", ""));
    });
  });
};

var printHelp = function() {
  console.log("Usage example:");
  console.log("  batty https://localhost:3000/");
};

var printDiff = function(a, b) {
  var expected = JSON.stringify(route.response);
  var actual = JSON.stringify(data);

  console.log("EXPECTED: " + expected);
  console.log("ACTUAL  : " + actual);
};
