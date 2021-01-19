const mongoose = require("mongoose");
mongoose.Schema.Types.String.set("trim", true);

const stateSchema = new mongoose.Schema(
  {
    id: String,
    name: String,
    short_name: String
  }
);


module.exports = mongoose.model("State", stateSchema);
