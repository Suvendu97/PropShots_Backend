const NodeGeocoder = require("node-geocoder");

const options = {
    provider: "google",
    httpAdapter: "https",
    apiKey: process.env.GOOGLE_MAPS_KEY,
    formatter: null,
  };
  
  const geocoder = NodeGeocoder(options);

  module.exports = geocoder;