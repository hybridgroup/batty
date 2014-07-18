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

  var eventRoute = "/api/robots/TestBot/devices/ping/events/ping";

  var es = new EventSource(base + eventRoute);

  es.onmessage = function(e) {
    console.log(eventRoute + " PASSED".green);
    es.close();
  };

  es.onerror = function(e) {
    console.log(eventRoute + " ERROR".red);
    console.log(es);
  };

  async.mapSeries(routes, test);
};

var printHelp = function() {
  console.log("Usage example:");
  console.log("  batty https://localhost:3000/");
};
