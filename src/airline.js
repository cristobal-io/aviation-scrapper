"use strict";
var chalk = require("chalk");
var debug = require("debug")("airlineData:airline");
var sjs = require("scraperjs");

var scrapers = require("../scrapers/");


function getAirlineData(airline, callback) {
  var url = airline;

  debug("Getting destinations from %s", url);
  sjs.StaticScraper.create(url)
    .catch(function (err, utils) {
      // Bermi, if I get an error because of a missing property, I get this catch called.
      // I think it shouldn'be calling this callback, because the error is coming from
      // schema validation, this schema validation is being done at the test. It seems like 
      // this executes the callback at the same time it sends it back.
      if (err) {
        debug(chalk.red("\nerror from %s is %s, %s \n"), airline.name, err, url);
        callback(err, utils);
      }
    })
    .scrape(scrapers["airline"])
    .then(function (data) {
      callback(null, data);
    });
}

module.exports.getAirlineData = getAirlineData;