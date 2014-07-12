"use strict";

var path = require("path");

var jsonForRoute = function jsonForRoute(route) {
  var json = path.normalize(__dirname + "/../responses" + route + ".json");
  return require(json);
};

module.exports = {
  "/api": {
    method: "GET",
    response: jsonForRoute("/api")
  },

  "/api/commands": {
    method: "GET",
    response: jsonForRoute("/api/commands")
  }
};
