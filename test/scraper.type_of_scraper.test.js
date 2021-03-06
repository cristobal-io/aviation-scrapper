"use strict";
// Mocha
var chai = require("chai");
var expect = chai.expect;
// JSON schema validator.
var Ajv = require("ajv");
var ajv = Ajv();


var airlineScraper = require("../src/airline_scraper.js");
var getScraperType = airlineScraper.getScraperType;
var getScraperTypeForAll = airlineScraper.getScraperTypeForAll;

var options = require("./fixtures/scraper_options.json");

describe("Type of Scraper\n", function () {
  var validateDestPagSchema;

  before(function () {
    var destinationsPagesSchema = require("../schema/destination_pages.schema.json");

    validateDestPagSchema = ajv.compile(destinationsPagesSchema);
  });

  it("Should return default scraper", function (done) {
    getScraperType(options[0], function (err, results) {
      expect(results.type).to.eql("default");
      done();
    });
  });

  it("Should return table scraper", function (done) {
    getScraperType(options[2], function (err, results) {
      expect(results.type).to.eql("table");
      done();
    });
  });

  it("Should return table_center scraper", function (done) {
    getScraperType(options[3], function (err, results) {
      expect(results.type).to.eql("table_center");
      done();
    });
  });

  it("Should return table scraper", function (done) {
    getScraperType(options[1], function (err, results) {
      expect(results.type).to.eql("table");
      done();
    });
  });


  it("Should return an array that passes the schema validation (AJV)", function (done) {

    getScraperTypeForAll(options[2], function (err, results) {
      if (err) {throw err;}

      var validDestPagSchema = validateDestPagSchema(results);

      if (!validDestPagSchema) {
        console.log(validateDestPagSchema.errors);// eslint-disable-line no-console
      }
      expect(validDestPagSchema).to.be.true;

      done();
    });
  });

  it("Should return an array that passes the schema validation (TV4)", function (done) {

    var destinationsPagesSchema = require("../schema/destination_pages.schema.json");

    getScraperTypeForAll(options[2], function (err, results) {
      if (err) {throw err;}

      var valid = chai.tv4.validate(results, destinationsPagesSchema);

      if (!valid) {
        console.log("error: ", chai.tv4.error.message);// eslint-disable-line no-console
      }
      expect(results).to.be.jsonSchema(valid);

      chai.tv4.dropSchemas();
      done();
    });
  });

});
