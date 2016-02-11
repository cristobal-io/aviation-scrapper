"use strict";
// Mocha
var chai = require("chai");
var expect = chai.expect;

var source = require("../src/index.js");
var getAirports = source.getAirports;
var writeJson = source.writeJson;
var getAirportsData = source.getAirportsData;
var getData = source.getData;
var getAirportFileName = source.getAirportFileName;

var fs = require("fs");
var Ajv = require("ajv");
var ajv = Ajv();

var _ = require("lodash");

var airlines = require("./fixtures/airlines.json");
var airportsLink = require("./fixtures/airport_links.json");

describe("airports.js\n", function () {
  describe("getAirports", function () {

    it("should return only airports", function () {
      var airportsSchema = require("../schema/airport_links.schema.json");
      var airports = getAirports(airlines);
      var validateAirportsSchema = ajv.compile(airportsSchema);
      var validAirports = validateAirportsSchema(airports);

      expect(validAirports, _.get(validateAirportsSchema, "errors[0].message")).to.be.true;
    });

    it("Should not have duplicated airports", function (done) {
      var airlinesDestinations = require("./fixtures/airlines_destinations.json");
      var airports = getAirports(airlinesDestinations);

      _.map(_.groupBy(airports, function (airport) {
        return airport.name;
      }), function (grouped) {
        expect(grouped).to.have.length(1);
      });
      done();
    });


  });

  describe("getData", function() {
    it("Should return valid schema data", function() {
      var airportsSchema = require("../schema/airport_data.schema.json");
      var validateAirportsDataSchema = ajv.compile(airportsSchema);

      getData(airportsLink[0], function(err, airportData) {
        var validAirportsData = validateAirportsDataSchema([airportData]);

        expect(validAirportsData, _.get(validateAirportsDataSchema, "errors[0].message")).to.be.true;
      });
    });

  });
  describe("getAirportFileName", function() {

    it("Should save the files with the proper name", function() {
      getData(airportsLink[0], function(err, airportData) {
        expect(airportData.fileName, airportData.errorMessage).to.eql("./data/airport_Amsterdam_Airport_Schiphol.json");
      });
    });

    it("Should save the files with errors with a different message", function () {
      var badAirportName = getAirportFileName({"url":"http://localhost:3000/bad_filename"});

      expect(badAirportName.fileName).to.eql("./data/airport_error_bad_filename.json");
    });

  });

  describe("writeJson", function () {

    it("Should save a file", function (done) {
      var fileName = "./data/sampleObject.json",
        fileExists;
      var sampleObject = {
        "foo": "bar"
      };

      // bermi how do I test writeJson if there wasn't a callback?
      writeJson(sampleObject, fileName, function () {
        fileExists = fs.readFileSync(fileName, "utf8");
        expect(fileExists).to.eql("{\n  \"foo\": \"bar\"\n}");
        fs.unlink(fileName, function (err) {
          if (err) {
            console.log(err); //eslint-disable-line no-console
          }
          done();
        });
      });
    });

  });

  describe("getAirportsData", function () {

    it("should return the airport data with the proper schema", function (done) {
      this.timeout(15000);

      var airportDataSchema = require("../schema/airport_data.schema.json");
      var validateAirportDataSchema = ajv.compile(airportDataSchema);

      getAirportsData(airportsLink, function(err, airportsData) {
        var validAirportData = validateAirportDataSchema(airportsData);

        expect(validAirportData, _.get(validateAirportDataSchema, "errors[0].message")).to.be.true;
        done();
      });

    });

  });

});
