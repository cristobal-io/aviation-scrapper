"use strict";

var sjs = require("scraperjs");
var fs = require("fs");
var scrapers = require("../scrapers/");
var async = require("async");

var BASE_URL = "https://en.wikipedia.org";

// var _ = require("lodash");
// var airlines = require("../data/destination_pages.json");

function getRoutes(options, callback) {
  var url = options.url || BASE_URL + options.destinationsLink;

  if (process.env.NODE_ENV !== "test") {
    console.log("Getting routes for %s from %s", options.name, url); // eslint-disable-line no-console
  }
  sjs.StaticScraper.create(url)
    .catch(function (err, utils) {
      if (err) {
        console.log("error from %s is %s", options.name, err); // eslint-disable-line no-console
        // callback(err, utils);
      } else {
        console.log(utils); // eslint-disable-line no-console
      }
    })
    .scrape(scrapers[options.scraper] || scrapers["default"])
    .then(function (data) {
      // bermi: is this a good practice?
      options.routes = data;
      writeJson(null, options, callback);
    });
}

var writeJson = function (err, options, callback) {
  if (err) {
    throw err;
  }
  var filename = options.destinationsFile || "./data/routes_" + options.name + ".json";

  fs.writeFile(filename,
    JSON.stringify(options.routes, null, 2),
    function (err) {
      if (err) {
        throw err;
      }
      if (process.env.NODE_ENV !== "test") {
        console.log("Saved %s", filename); // eslint-disable-line no-console
      }
      callback(null, options);
    }
  );
};

function getAllRoutes(airlines, callback) {
  // console.log(airlines);
  async.map(airlines, function (options, callback) {
    // console.log(options);
    getRoutes(options, callback);
  }, function (err, options) {
    if (err) {
      throw err;
    }
    callback(null, options);
  });
}

module.exports.getRoutes = getRoutes;
module.exports.getAllRoutes = getAllRoutes;

// airlines = _.where(airlines, {
//   "isolate": true
// }) || airlines;
// console.trace(airlines);
// process.exit();
// getRoutes(airlines[1], writeJson);

// getAllRoutes(airlines, function () {
//   console.log("callback finished");
// });
