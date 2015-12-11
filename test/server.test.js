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
// todo: fix the hardcoded value on json file.

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