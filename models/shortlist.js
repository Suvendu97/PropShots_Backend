const mongoose = require("mongoose");
mongoose.Schema.Types.String.set("trim", true);

const shortlistSchema = new mongoose.Schema(
  {
    user: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
    prop: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property",
      },
      img: [String],
      name: String,
      phone: String,
      pId: String,
      mPhone: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Shortlist", shortlistSchema);
