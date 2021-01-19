const mongoose = require("mongoose");
const geocoder = require("../config/geocoder");
mongoose.Schema.Types.String.set("trim", true);

const propertySchema = new mongoose.Schema(
  {
    pId: {
      type: String,
    },
    pFor: {
      type: String,
      required: true,
    },
    typ: {
      type: String,
      required: true,
    },
    subCat: {
      type: String,
      required: true,
    },
    exCat: {
      type: String,
      required: true,
    },
    ar: {
      type: Number,
      required: true,
    },
    arUnit: {
      type: String,
      required: true,
    },
    propAge: {
      type: String,
    },
    yr: {
      type: String,
      // required: true,
    },
    mv: {
      type: Number,
      required: true,
    },
    desc: {
      type: String,
    },
    disPer: {
      type: Number,
      default: 0.0,
    },
    disVal: {
      type: Number,
      default: 0.0,
    },
    location: {
      type: {
        type: String,
        enum: ['Point']
      },
      coordinates: {
        type: [Number],
        index: '2dsphere'
      },
      add: {
        type: String
      },
      ct: {
        type: String
      },
      st: {
        type: String
      },
      locality: {
        type: String
      }
    },
    by: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      name: String,
      phone: String,
    },
    photo: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

propertySchema.pre('save', async function (next) {
  if (this.location.add) {
    const loc = await geocoder.geocode(this.location.add);
    this.location = {
      type: 'Point',
      coordinates: [loc[0].longitude, loc[0].latitude],
      add: loc[0].formattedAddress,
      ct: this.location.ct,
      st: this.location.st,
      locality: this.location.locality.split(',')[0]
    };
  }
  next();
});

module.exports = mongoose.model("Property", propertySchema);
