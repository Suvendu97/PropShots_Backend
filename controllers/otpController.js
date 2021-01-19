require("dotenv").config();
const Otp = require("../models/otp");
const unirest = require("unirest");
const rn = require("random-number");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const { findOne } = require("../models/user");
const USER = require("../models/user");

const sendOTP = (otp, phone) => {
  const body = `<SmsQueue>
                                  <Account>
                                  <APIKey>${process.env.SMS_KEY}</APIKey>
                                  <SenderId>PRSHOT</SenderId>
                                  <Channel>2</Channel>
                                  <DCS>0</DCS>
                                  <FlashSms>0</FlashSms>
                                  <Route>1</Route>
                                  </Account>
                                  <Messages><Message>
                                  <Number>${phone}</Number>
                                  <Text> ${otp} is your OTP to login propshots.in, the fastest and easiest way to buy, sell and rent your properties on discount.
                                  </Text>
                                  <Text></Text>
                                  </Message></Messages>
                              </SmsQueue>`;

  var config = {
    headers: {
      "Content-Type": "text/xml",
    },
  };

  axios.post("https://www.smsgatewayhub.com/api/mt/SendSms", body, config).then((res) => {
    console.log("Success");
  });
  // res.send("Successfully sent");
};

// Generate a random OTP store in DB and send response to client.
module.exports.generate = async function (req, res) {
  const gen = rn.generator({
    min: 100000,
    max: 999999,
    integer: true,
  });
  req.body.valid = true;
  req.body.otp = gen();

  try {
    console.log("hey");
    if (req.body.phone.length == 12) {
      req.body.phone = req.body.phone.substring(2);
    }
    await USER.findOne({ phone: req.body.phone })
      .then(async (user) => {
        if (user) {
          sendOTP(req.body.otp, user.phone);
          let oldOtp = await Otp.findOne({ phone: user.phone });
          if (oldOtp == null) {
            let newOtp = await Otp.create(req.body);
            return res.json(200, {
              data: {
                message: "otp generated 1",
              },
            });
          } else {
            oldOtp.otp = req.body.otp;
            oldOtp.valid = true;
            oldOtp.save();
            return res.json(200, {
              data: {
                message: "otp generated 2",
              },
            });
          }
        } else {
          console.log("USER NOT FOUND");
        }
      })
      .catch((err) => {
        console.log("ERROR" + err);
      });
  } catch (error) {
    console.log(error);
  }
};

// resend otp
module.exports.resend = async function (req, res) {
  if (req.body.phone.length == 12) {
    req.body.phone = req.body.phone.substring(2);
  }
  const gen = rn.generator({
    min: 100000,
    max: 999999,
    integer: true,
  });
  // req.body.valid = true;
  req.body.otp = gen();

  sendOTP(req.body.otp, req.body.phone);

  try {
    let oldOtp = await Otp.findOne({ phone: req.body.phone });

    if (oldOtp == null) {
      let newOtp = await Otp.create(req.body);
      return res.json(200, {
        data: {
          message: "otp generated 3",
        },
      });
    } else {
      oldOtp.otp = req.body.otp;
      oldOtp.valid = true;
      oldOtp.save();
      return res.json(200, {
        data: {
          message: "otp generated 4",
        },
      });
    }
  } catch (error) {
    console.log(error);
  }
};

// verify  OTP stored in DB and send response to client.
module.exports.verify = async function (req, res) {
  try {
    // console.log("phone ",req.body.phone," ",req.body.otp,"req", req.body)
    if (req.body.phone.length == 12) {
      req.body.phone = req.body.phone.substring(2);
    }
    let otp = await Otp.findOne({ phone: req.body.phone });

    if (otp == null) {
      return res.json(404, {
        message: "otp Not verified",
      });
    } else {
      if (otp.valid === false) {
        return res.json(404, {
          status: 404,
          message: "otp Not verified",
        });
      }

      var date = new Date(new Date());

      if (date - otp.updatedAt > 900000) {
        otp.valid = false;
        otp.save();

        return res.json(404, {
          status: 404,
          message: "otp expired",
        });
      }

      if (otp.otp == req.body.otp) {
        otp.valid = false;
        otp.save();
        let user = await USER.findOne({ phone: req.body.phone });
        if (req.body.ip) {
          user.IP = req.body.ip.ip;
        }
        if (req.body.browData) {
          user.browserName = req.body.browData.name;
          user.browserOs = req.body.browData.platform;
          user.browserVersion = req.body.browData.version;
        }
        if (req.body.currentLat && req.body.currentLng) {
          user.lat = req.body.currentLat;
          user.lon = req.body.currentLng;
        }
        user.save();
        return res.json({
          Token: jwt.sign(user.toJSON(), process.env.JWTSECRET, { expiresIn: "3d" }),
          message: "User Logged in",
        });
      } else {
        return res.json(404, {
          status: 404,
          message: "otp not verified",
        });
      }
    }

  } catch (error) {
    console.log("something went wrong 1")
  }
};
