const Shortlist = require("../models/shortlist"),
  // const Property =require("../models/property")
  passport = require("passport"),
  Property = require("../models/property");

module.exports.getShortlist = async (req, res) => {
  try {
    await Shortlist.find({ "user.id": req.user._id }).sort({ createdAt: -1 })
      .then((shortlist) => {
        let result = []
        shortlist.forEach(element => {
          let data = {
            id: element._id,
            isVerified: element.isVerified,
            prop: {
              id: element.prop.id,
              img: element.prop.img,
              name: element.prop.name,
              phone: element.isVerified ? element.prop.phone : element.prop.mPhone,
              pId: element.prop.pId,
              ShortlistedDate: element.createdAt
            }
          };
          console.log(result)
          result.push(data);
        });
        res.json(result);
      })
      .catch((err) => res.json(err));
  } catch (error) {
    console.log("Something went wrong")
  }
};

module.exports.getShortlistedData = async (req, res) => {
  console.log(req.params)
  try {
    await Property.findById(req.params.id)
      .then((property) => {
        console.log(property)
        res.json(property);
      })
      .catch((err) => res.json(err));
  } catch (error) {
    console.log("Something went wrong")
  }
};

// module.exports.shortlistDetail = async (req, res) => {
//   await Shortlisted.findById(req.params.id)
//     .then(async (shortlist) => {
//       Property.findById(shortlist.prop)
//         .then((property) => {
//           res.json(property);
//         })
//         .catch((err) => res.json(err));
//     })
//     .catch((err) => res.json(err));
// };

module.exports.addToShortlist = async (req, res) => {
  try {
    function masking(maskedPhone) {
      let result = "XXXXXX";
      for (var i = 6; i < 10; i++) {
        result = result + maskedPhone.charAt(i);
      }
      return result;
    }
    await Property.findById(req.params.id)
      .then(async (propFound) => {
        // console.log("property",propFound);
        await Shortlist.findOne({ "prop.id": req.params.id, "user.id": req.user._id })
          .then(async (shortlist) => {
            if (shortlist) {
              res.json("already shortlisted");
            } else {
              let maskedPhoneNo = await masking(propFound.by.phone);
              shortlist = new Shortlist({
                user: {
                  id: req.user._id,
                },
                prop: {
                  id: req.params.id,
                  img: propFound.photo,
                  name: propFound.by.name,
                  phone: propFound.by.phone,
                  pId: propFound.pId,
                  mPhone: maskedPhoneNo
                },
              });
              shortlist.save();
              res.json("Shortlisted");
            }
          })
          .catch((err) => res.json("Something went wrong ", err));
      })
      .catch((err) => res.json("Something went wrong ", err));
  } catch (error) {
    console.log("Something went wrong")
  }
};

module.exports.removeFromShortlist = async (req, res) => {
  try {
    await Shortlist.findByIdAndRemove(req.params.id)
      .then(() => {
        res.json("Removed from shortlisted");
      })
      .catch((err) => res.json("Something went wrong ", err));
  } catch (error) {
    console.log("something went wrong ", error)
  }
};
