"use strict";

var Routes = source("routes");

describe("Routes", function() {
  describe("each one", function() {
    Object.keys(Routes).forEach(function(key) {
      var route = Routes[key];

      it("should have a 'method' key", function() {
        var methods = ["GET", "POST"];

        expect(route.method).to.be.a('string');
        expect(methods).to.include(route.method);
      });

      it("should have a 'response' key", function() {
        expect(route.response).to.be.an('object');
      });
    });
  });
});
