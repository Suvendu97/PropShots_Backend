require("dotenv").config();
const user = require("../models/user"),
  PropertyId = require("../models/propertId"),
  Property = require("../models/property"),
  ShortlistProperty = require("../models/shortlist"),
  IgnoredlistProperty = require("../models/ignoredList"),
  cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "www-propshots-in",
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

//	POST A NEW PROPERTY
module.exports.postProperty = async (req, res) => {
  console.log('req.body')
  try {
    const dig = function (s, width, char) {
      return (s.length >= width) ? s : (new Array(width).join(char) + s).slice(-width);
    }
    if (req.body.photo) {
      for (let i = 0; i < req.body.photo.length; i++) {
        let uploadeResponse = await cloudinary.uploader.upload(req.body.photo[i], { upload_preset: "Test" });
        req.body.photo[i] = uploadeResponse.secure_url;
      }
    }
    await Property.create(req.body)
      .then(async (property) => {
        let Id = await PropertyId.find({});
        if (Id.length > 0) {
          Id[0].pId = Id[0].pId + 1;
          property.pId = await dig(Id[0].pId, 8, '0');
          Id[0].save();
        } else {
          Id = await PropertyId.create({
            pId: 1,
          })
          Id.save();
          property.pId = await dig(Id.pId, 8, '0');
        }
        property.by = { id: req.user._id, name: req.user.name, phone: req.user.phone };
        property.save((doc,err) => {
          console.log('doc ==>', doc)
          console.log('err=>', err)
          res.json("Post Success");
        });
      })
      .catch((err) => res.json("Something went wrong ", err));
  } catch (error) {
    console.log("server error " + error);
  }
};

//	UPDATE A PROPERTY
module.exports.updateProperty = async (req, res) => {
  try {
    for (let i = 0; i < req.body.photo.length; i++) {
      let uploadeResponse = await cloudinary.uploader.upload(req.body.photo[i], { upload_preset: "Test" });
      req.body.photo[i] = uploadeResponse.secure_url;
    }
    await Property.findByIdAndUpdate(req.params.id, req.body)
      .then((property) => {
        if (property)
          res.json("Update Success");
      })
      .catch((err) => res.json("Something went wrong. Try again"));
  } catch (error) {
    console.log("server error");
  }
};

//	DELETE A PROPERTY
module.exports.deleteProperty = async (req, res) => {
  try {
    await Property.findByIdAndRemove(req.params.id)
      .then(() => {
        res.json("Deleted");
      })
      .catch((err) => res.json("Something went wrong"));
  } catch (error) {
    res.json("Server Error")
  }
};

//	SHOW A PROPERTY DETAILS
// module.exports.showPropertyDetail = async (req, res) => {
//   await Property.findById(req.params.id)
//     .then((property) => {
//       res.json(property);
//     })
//     .catch((err) => res.json(err));
// };

//	SHOW ALL PROPERTIES
module.exports.getAllProperties = async (req, res) => {
  try {
    let query = {};
    if (req.query.pFor && req.query.pFor !== '') {
      query.pFor = new RegExp(req.query.pFor, 'i');
    }
    if (req.query.typ && req.query.typ !== '') {
      query.typ = new RegExp(req.query.typ, 'i');
    }
    if (req.query.yr && req.query.yr !== '' && req.query.yr !== 'across_india') {
      query.propAge = new RegExp(req.query.yr, 'i')
    }
    if (req.query.st && req.query.st !== '') {
      query['location.add'] = { '$in': [new RegExp(req.query.st, 'i')] }
    }

    if (req.query.locality && req.query.locality !== '') {
      query['location.locality'] = { '$in': [new RegExp(req.query.locality, 'i')] }
    }
    // console.log(query)
    if (req.query.ct && req.query.st !== '') {
      if (query['location.add']) {
        query['location.add']['$in'].push(new RegExp(req.query.ct, 'i'))
      } else {
        query['location.add'] = new RegExp(req.query.ct, 'i')
      }
    }
    let n = req.body.number;
    let totalPropertySkip = (n * 50);
    let skipShortlistProperty = await ShortlistProperty.find({ "user.id": req.user._id });
    var excludeId = [];
    skipShortlistProperty.forEach(element => {
      excludeId.push(element.prop.id);
    });

    let skipIgnoredlistProperty = await IgnoredlistProperty.find({ "user.id": req.user._id });
    skipIgnoredlistProperty.forEach(element => {
      excludeId.push(element.prop.id);
    });

    let skipMypostedProperty = await Property.find({ "by.id": req.user._id });
    skipMypostedProperty.forEach(element => {
      excludeId.push(element._id);
    });

    query._id = { $nin: excludeId };
    // console.log('query start')
    // console.log(query)
    // console.log('query end')

    // if (req.query.lat && req.query.long) {
    //   query.location =
    //   {
    //     $near:
    //     {
    //       $geometry: { type: "Point", coordinates: [req.query.long, req.query.lat] },
    //       $maxDistance: 20000
    //     }
    //   }
    // }
    await Property.find(query).sort({ updatedAt: -1 }).skip(totalPropertySkip).limit(50)
      .then((property) => {
        // console.log(property)
        res.json(property);
      })
      .catch((err) => res.json(err));
  } catch (error) {
    console.log("Something went wrong", error)
  }

};

//	SHOW USER PROPERTIES
module.exports.getUserProperties = async (req, res) => {
  try {
    await Property.find({ "by.id": req.user._id }).sort({ createdAt: -1 })
      .then((property) => {
        res.json(property);
      })
      .catch((err) => res.json(err));
  } catch (error) {
    console.log("something went wrong")
  }
};
