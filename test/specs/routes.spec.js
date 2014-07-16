"use strict";

var Routes = source("routes");

describe("Routes", function() {
  describe("each one", function() {
    Routes.forEach(function(route) {
      it("should have a 'path' key", function() {
        expect(route.path).to.be.a('string');
      });

      it("should have a 'method' key", function() {
        var methods = ["get", "post"];

        expect(route.method).to.be.a('string');
        expect(methods).to.include(route.method);
      });

      it("should have a 'response' key", function() {
        expect(route.response).to.be.an('object');
      });
    });
  });
});
