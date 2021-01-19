const mongoose = require("mongoose");

const ignoredlistSchema = new mongoose.Schema({
    user: {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
      prop: {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "PropertyNew",
        }
    }
},{
    timestamps: true
});

module.exports = mongoose.model("Ignoredlist", ignoredlistSchema);