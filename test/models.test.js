"use strict";
// Mocha
var chai = require("chai");
var expect = chai.expect;
// server
var express = require("express");
var serveStatic = require("serve-static");
var app = express();
// scraper
var sjs = require("scraperjs");
// constants
var BASE_URL = "http://localhost";
var PORT = 3000;
var MODELS_DIR = "/spec/models/";
var SERVER_LISTENING = BASE_URL + ":" + PORT;

before("start server", function (done) {
  app.use(serveStatic(__dirname + MODELS_DIR));
  isPortTaken(PORT, function (err, data) {
    if (!data) {
      app.listen(PORT);
    }
    done();
  });
});

describe("Server is on", function () {

  it("Confirm scraper is working with index.html", function () {
    sjs.StaticScraper.create(SERVER_LISTENING)
      .scrape(function ($) {
        return $("h1").text();
      })
      .then(function (data) {
        expect(data).to.eql("Models");
      });
  });

  it("Check the page AeroSur_destinations is on", function () {
    sjs.StaticScraper.create(SERVER_LISTENING + "/AeroSur_destinations.html")
      .scrape(function ($) {
        return $("h1").text();
      })
      .then(function (data) {
        expect(data).to.eql("AeroSur destinations");
      });
  });

});

describe("does it works outside the suite?", function () {

  it("Should get the siteSub id value", function () {
    sjs.StaticScraper.create(SERVER_LISTENING + "/AeroSur_destinations.html")
      .scrape(function ($) {
        return $("#siteSub").text();
      })
      .then(function (data) {
        expect(data).to.eql("From Wikipedia, the free encyclopedia");
      });
  });

});

var options = [{
  name: "default",
  destinationsLink: "/AeroSur_destinations.html",
  url: SERVER_LISTENING + "/AeroSur_destinations.html",
  destinationsFile: "./test/spec/data/destination_pages.json",
  airlines: [{
    name: "default",
    destinationsLink: "/AeroSur_destinations.html",
    url: SERVER_LISTENING + "/AeroSur_destinations.html"
  }]
},{
  name: "table_with_origins",
  destinationsLink: "/Adria_Airways_destinations.html",
  url: SERVER_LISTENING + "/Adria_Airways_destinations.html",
  destinationsFile: "./test/spec/data/destination_pages.json",
  airlines: [{
    name: "table_with_origins",
    destinationsLink: "/Adria_Airways_destinations.html",
    url: SERVER_LISTENING + "/Adria_Airways_destinations.html"
  }]

},{
  name: "table",
  destinationsLink: "/Aegean_Airlines_destinations.html",
  url: SERVER_LISTENING + "/Aegean_Airlines_destinations.html",
  destinationsFile: "./test/spec/data/destination_pages.json",
  airlines: [{
    name: "table",
    destinationsLink: "/Aegean_Airlines_destinations.html",
    url: SERVER_LISTENING + "/Aegean_Airlines_destinations.html"
  }]

}
];

var airlineScraperType = require("../src/airline_scraper.js");
var getScraperType = airlineScraperType.getScraperType;
var getScraperTypeForAll = airlineScraperType.getScraperTypeForAll;

describe("Type of Scraper", function () {

  it("Should return default scraper", function (done) {
    getScraperType(options[0], function (err, results) {
      expect(results.type).to.eql("default");
      done();
    });
  });

  it("Should return table_with_origins scraper", function (done) {
    getScraperType(options[1], function (err, results) {
      expect(results.type).to.eql("table_with_origins");
      done();
    });
  });

  it("Should return table scraper", function (done) {
    getScraperType(options[2], function (err, results) {
      expect(results.type).to.eql("table");
      done();
    });
  });

  it("Should return and save the type_of_scrapper for all airports", function (done) {
    var destinations_pages = require("./schema/destination_pages.schema.json");

    getScraperTypeForAll(options[0], function (results) {
      // console.log(results);
      expect(results).to.be.an("array");
      expect(results).to.be.jsonSchema(destinations_pages);
      done();
    });
  });

});

function isPortTaken(port, fn) {
  var net = require("net");
  var tester = net.createServer()
    .once("error", function (err) {
      if (err.code != "EADDRINUSE") {
        return fn(err);
      }
      fn(null, true);
    })
    .once("listening", function () {
      tester.once("close", function () {
          fn(null, false);
        })
        .close();
    })
    .listen(port);

}
