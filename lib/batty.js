"use strict";

require('colors');

var async = require('async'),
    EventSource = require('eventsource');

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

  [
    "/api/robots/TestBot/events/hello",
    "/api/robots/TestBot/devices/ping/events/ping"
  ].forEach(function(route) {
    var es = new EventSource(base + route);

    es.onmessage = function(e) {
      console.log(route + " PASSED".green);
      es.close();
    };

    es.onerror = function(e) {
      console.log(route + " ERROR".red);
      console.log(es);
      es.close();
    };

  });

  async.mapSeries(routes, test);
};

var printHelp = function() {
  console.log("Usage example:");
  console.log("  batty https://localhost:3000/");
};
