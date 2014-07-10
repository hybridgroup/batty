"use strict";

var Batty = source("batty");

describe("Batty", function() {
  it("has a quote", function() {
    var result = Batty();
    expect(result).to.eql("Can the maker repair what he makes?");
  });
});
