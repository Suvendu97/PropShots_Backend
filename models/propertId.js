const mongoose = require("mongoose");
mongoose.Schema.Types.String.set("trim", true);

const propertyIdSchema = new mongoose.Schema({

    pId: {
        type: Number
    }
});

module.exports = mongoose.model("PropertyId", propertyIdSchema);
