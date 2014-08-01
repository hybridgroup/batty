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
    response: [200, jsonForRoute("/api")]
  },

  {
    path: "/api/commands",
    method: "get",
    response: [200, jsonForRoute("/api/commands")]
  },

  {
    path: "/api/commands/echo",
    method: "post",
    response: [200, jsonForRoute("/api/commands/echo")],
    body: { a: 10 }
  },

  {
    path: "/api/commands/echo",
    method: "post",
    response: [500, jsonForRoute("/api/commands/echo_error")]
  },

  {
    path: "/api/robots",
    method: "get",
    response: [200, jsonForRoute("/api/robots")]
  },

  {
    path: "/api/robots/TestBot",
    method: "get",
    response: [200, jsonForRoute("/api/robots/TestBot")]
  },

  {
    path: "/api/robots/NonExistentBot",
    method: "get",
    response: [404, jsonForRoute("/api/robots/NonExistentBot")]
  },

  {
    path: "/api/robots/TestBot/commands",
    method: "get",
    response: [200, jsonForRoute("/api/robots/TestBot/commands")]
  },

  {
    path: "/api/robots/TestBot/commands/hello",
    method: "post",
    response: [200, jsonForRoute("/api/robots/TestBot/commands/hello")],
    body: { greeting: "everybody" }
  },

  {
    path: "/api/robots/TestBot/devices",
    method: "get",
    response: [200, jsonForRoute("/api/robots/TestBot/devices")]
  },

  {
    path: "/api/robots/TestBot/devices/ping",
    method: "get",
    response: [200, jsonForRoute("/api/robots/TestBot/devices/ping")]
  },

  {
    path: "/api/robots/TestBot/devices/pong",
    method: "get",
    response: [404, jsonForRoute("/api/robots/TestBot/devices/pong")]
  },

  {
    path: "/api/robots/TestBot/devices/ping/commands",
    method: "get",
    response: [200, jsonForRoute("/api/robots/TestBot/devices/ping/commands")]
  },

  {
    path: "/api/robots/TestBot/devices/ping/commands/ping",
    method: "get",
    response: [200, jsonForRoute("/api/robots/TestBot/devices/ping/commands/ping")]
  },

  {
    path: "/api/robots/TestBot/connections",
    method: "get",
    response: [200, jsonForRoute("/api/robots/TestBot/connections")]
  },

  {
    path: "/api/robots/TestBot/connections/loopback",
    method: "get",
    response: [200, jsonForRoute("/api/robots/TestBot/connections/loopback")]
  },

  {
    path: "/api/robots/TestBot/connections/loopforward",
    method: "get",
    response: [404, jsonForRoute("/api/robots/TestBot/connections/loopforward")]
  },
];
