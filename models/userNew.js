var mongoose = require("mongoose");

const userNewSchema = new mongoose.Schema(
  {
    phone: {
      type: Number,
      // required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    browserName: {
      type: String,
      trim: true,
    },
    browserVersion: {
      type: String,
      trim: true,
    },
    browserOs: {
      type: String,
      trim: true,
    },
    IP: {
      type: String,
      trim: true,
    },
    IPV6: {
      type: String,
      trim: true,
    },
    lat: {
      type: String,
    },
    lon: {
      type: String,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserNew", userNewSchema);