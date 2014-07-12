"use strict";

var Responses = source("responses");

describe("Responses", function() {
  describe("each one", function() {
    Object.keys(Responses).forEach(function(key) {
      var response = Responses[key];

      it("should have a 'method' key", function() {
        var methods = ["GET", "POST"];

        expect(response.method).to.be.a('string');
        expect(methods).to.include(response.method);
      });

      it("should have a 'response' key", function() {
        expect(response.response).to.be.an('object');
      });
    });
  });
});
