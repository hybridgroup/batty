"use strict";

require('colors');

var async = require('async');

var routes = require('./routes'),
    Request = require('./request');

module.exports = function Batty(base) {
  if (!base) {
    console.log("No base URL supplied");
    printHelp();
    return;
  }

  var test = function(route, callback) {
    new Request(base, route, callback);
  };

  async.mapSeries(routes, test);
};

var printHelp = function() {
  console.log("Usage example:");
  console.log("  batty https://localhost:3000/");
};
