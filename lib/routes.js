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
  },

  "/api/robots": {
    method: "get",
    response: jsonForRoute("/api/robots")
  },

  "/api/robots/TestBot": {
    method: "get",
    response: jsonForRoute("/api/robots/TestBot")
  },

  "/api/robots/TestBot/commands": {
    method: "get",
    response: jsonForRoute("/api/robots/TestBot/commands")
  },

  "/api/robots/TestBot/commands/hello": {
    method: "post",
    response: jsonForRoute("/api/robots/TestBot/commands/hello"),
    body: { greeting: "everybody" }
  },

  "/api/robots/TestBot/devices": {
    method: "get",
    response: jsonForRoute("/api/robots/TestBot/devices")
  },

  "/api/robots/TestBot/devices/ping": {
    method: "get",
    response: jsonForRoute("/api/robots/TestBot/devices/ping")
  },

  "/api/robots/TestBot/devices/ping/commands": {
    method: "get",
    response: jsonForRoute("/api/robots/TestBot/devices/ping/commands")
  },

  "/api/robots/TestBot/devices/ping/commands/ping": {
    method: "get",
    response: jsonForRoute("/api/robots/TestBot/devices/ping/commands/ping")
  },

  "/api/robots/TestBot/connections": {
    method: "get",
    response: jsonForRoute("/api/robots/TestBot/connections")
  },

  "/api/robots/TestBot/connections/loopback": {
    method: "get",
    response: jsonForRoute("/api/robots/TestBot/connections/loopback")
  },
};
