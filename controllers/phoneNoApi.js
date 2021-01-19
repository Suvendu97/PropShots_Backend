require("dotenv").config();
const Otp = require("../models/otp");
const unirest = require("unirest");
const rn = require("random-number");
const axios = require("axios");
const { findOne } = require("../models/user");
const USER = require("../models/user");
const shortlist = require("../models/shortlist");

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
                                  <Text>To view contact details of your seller on proposhots.in please enter ${otp} as an OTP.  </Text>
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
module.exports.send = async function (req, res) {
  const gen = rn.generator({
    min: 100000,
    max: 999999,
    integer: true,
  });
  req.body.valid = true;
  req.body.otp = gen();

  try {

    let user= req.user;
    req.body.phone = user.phone;
         
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
        

  } catch (error) {
    console.log(error);
  }
};

// resend otp
module.exports.resend = async function (req, res) {
  req.body.phone= req.user.phone;
  
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

  sendOTP(req.body.otp, req.user.phone);

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
    req.body.phone = req.user.phone;
    req.body.otp = req.query.otp;

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
      const verifiedShortlist = await shortlist.findById(req.query.id);
      verifiedShortlist.isVerified = true;
      verifiedShortlist.save();

      return res.json({
        flag : true,
        message: "User Verified",
      });
    } else {
      return res.json({
        flag : false,
        message: "otp not verified",
      });
    }
  }
};
