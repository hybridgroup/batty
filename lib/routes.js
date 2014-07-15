"use strict";

var path = require("path");

var jsonForRoute = function jsonForRoute(route) {
  var json = path.normalize(__dirname + "/../responses" + route + ".json");
  return require(json);
};

module.exports = {
  "/api": {
    method: "get",
    response: jsonForRoute("/api")
  },

  "/api/commands": {
    method: "get",
    response: jsonForRoute("/api/commands")
  },

  "/api/commands/echo": {
    method: "post",
    response: jsonForRoute("/api/commands/echo"),
    body: { a: 10 }
  }
};
