"use strict";

var Batty = source("batty");

describe("Batty", function() {
  beforeEach(function() {
    stub(console, 'log');
  });

  afterEach(function() {
    console.log.restore();
  });

  context("if no argument is passed", function() {
    it("prints the help", function() {
      Batty();
      expect(console.log).to.be.calledWith("No base URL supplied");
      expect(console.log).to.be.calledWithMatch("Usage example");
    });
  });
});
