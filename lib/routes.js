"use strict";

var path = require("path");

var jsonForRoute = function jsonForRoute(route) {
  var json = path.normalize(__dirname + "/../responses" + route + ".json");
  return require(json);
};

module.exports = [
  {
    path: "/api",
    method: "get",
    response: jsonForRoute("/api")
  },

  {
    path: "/api/commands",
    method: "get",
    response: jsonForRoute("/api/commands")
  },

  {
    path: "/api/commands/echo",
    method: "post",
    response: jsonForRoute("/api/commands/echo"),
    body: { a: 10 }
  },

  {
    path: "/api/robots",
    method: "get",
    response: jsonForRoute("/api/robots")
  },

  {
    path: "/api/robots/TestBot",
    method: "get",
    response: jsonForRoute("/api/robots/TestBot")
  },

  {
    path: "/api/robots/TestBot/commands",
    method: "get",
    response: jsonForRoute("/api/robots/TestBot/commands")
  },

  {
    path: "/api/robots/TestBot/commands/hello",
    method: "post",
    response: jsonForRoute("/api/robots/TestBot/commands/hello"),
    body: { greeting: "everybody" }
  },

  {
    path: "/api/robots/TestBot/devices",
    method: "get",
    response: jsonForRoute("/api/robots/TestBot/devices")
  },

  {
    path: "/api/robots/TestBot/devices/ping",
    method: "get",
    response: jsonForRoute("/api/robots/TestBot/devices/ping")
  },

  {
    path: "/api/robots/TestBot/devices/ping/commands",
    method: "get",
    response: jsonForRoute("/api/robots/TestBot/devices/ping/commands")
  },

  {
    path: "/api/robots/TestBot/devices/ping/commands/ping",
    method: "get",
    response: jsonForRoute("/api/robots/TestBot/devices/ping/commands/ping")
  },

  {
    path: "/api/robots/TestBot/connections",
    method: "get",
    response: jsonForRoute("/api/robots/TestBot/connections")
  },

  {
    path: "/api/robots/TestBot/connections/loopback",
    method: "get",
    response: jsonForRoute("/api/robots/TestBot/connections/loopback")
  },
];
