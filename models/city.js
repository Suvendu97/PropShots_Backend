const mongoose = require("mongoose");
mongoose.Schema.Types.String.set("trim", true);

const citySchema = new mongoose.Schema(
  {
    name: String,
    state_id : String
  }
);


module.exports = mongoose.model("City", citySchema);
