'use strict';

var path = require('path');

var argv = process.argv.slice(2);

module.exports = function Batty() {
  var base = argv[0];

  if (!base) {
    console.log("No base URL supplied");
    printHelp();
  }
};

var printHelp = function() {
  console.log("Usage example:");
  console.log("  batty https://localhost:3000/");
};
