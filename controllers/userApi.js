require("dotenv").config();
const USER = require("../models/user");
const jwt = require("jsonwebtoken");
// const { findOne } = require("../models/user");
const unirest = require("unirest");
const rn = require("random-number");
// const jwt = require("jsonwebtoken");
const axios = require("axios");
const Otp = require("../models/otp");
const request = require("request");
const nodemailer = require('nodemailer')


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
                                  <Text>${otp} is your OTP to login propshots.in, the fastest and easiest way to buy, sell and rent your properties on discount.
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



const sendPromo = (phone) => {
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
                                  <Text>Welcome to the fastest and easiest way to buy, sell or rent properties on discount. Post your property in 100 words and swipe right for a perfect match at propshots.in; use your mobile number to login and contact us for any queries.</Text>
                                  <Text></Text>
                                  </Message></Messages>
                              </SmsQueue>`;

  var config = {
    headers: {
      "Content-Type": "text/xml",
    },
  };

  axios.post("https://www.smsgatewayhub.com/api/mt/SendSms", body, config).then((res) => {
    console.log("Promo sent Success");
  });
  // res.send("Successfully sent");
};


// create user in db and register
module.exports.createUser = async function (req, res) {
  console.log(`Hello`);
  const gen = rn.generator({
    min: 100000,
    max: 999999,
    integer: true,
  });
  req.body.valid = true;
  req.body.otp = gen();
  if (req.body.phone.length == 12) {
    req.body.phone = req.body.phone.substring(2);
  }

  if (req.body.phone == null || req.body.name == null) {
    return res.json(404, {
      message: "Bad Request",
    });
  }

  try {
    let user = await USER.findOne({ phone: req.body.phone });
    console.log(user);
    if (!user) {
      let user1 = await USER.create(req.body);
      await sendOTP(req.body.otp, req.body.phone);
      let oldOtp = await Otp.findOne({ phone: req.body.phone });
      if (oldOtp == null) {
        let newOtp = await Otp.create(req.body);
      } else {
        oldOtp.otp = req.body.otp;
        oldOtp.valid = true;
        oldOtp.save();
      }
      console.log("User Registered Successfully!");
      await sendPromo(req.body.phone);
      return res.json(200, {
        message: "User Registered Successfully!",
      });
    } else {
      sendOTP(req.body.otp, user.phone);
      let oldOtp = await Otp.findOne({ phone: user.phone });
      console.log("User already exists!");
      if (oldOtp == null) {
        let newOtp = await Otp.create(req.body);
      } else {
        oldOtp.otp = req.body.otp;
        oldOtp.valid = true;
        oldOtp.save();
      }
      return res.json(200, {
        message: "User already exists! enter OTP to login",
      });
    }
  } catch (err) {
    console.log("Error", err);
    return res.json(500, {
      message: "Internal Server Error !",
    });
  }
};

// loging in user and creating token for him
module.exports.loginUser = async function (req, res) {
  if (req.body.phone == null) {
    return res.json(404, {
      message: "Bad Request",
    });
  }

  try {
    let user = await USER.findOne({ phone: req.body.phone });

    if (!user) {
      return res.json(422, {
        message: "Invalid phone",
      });
    }

    return res.json(200, {
      message: "Login Successful and here is your token",
      data: {
        jwtToken: jwt.sign(user.toJSON(), process.env.JWTSECRET, { expiresIn: "3d" }),
      },
    });
  } catch (err) {
    console.log("Error", err);
    return res.json(500, {
      message: "Internal Server Error",
    });
  }
};

module.exports.update = async function (req, res) {
  console.log(req.body);
  if (req.body == null) {
    return res.json(404, {
      message: "Bad Request",
    });
  }
  console.log(req.body);
  let user = await USER.findById(req.user._id);
  if (user) {
    try {
      let query = {};
      if (req.body.name) {
        query.name = req.body.name
      }
      if (req.body.email) {
        query.email = req.body.email
      }
      USER.findByIdAndUpdate(req.user._id, query, function (err, user) {
        return res.json(200, {
          message: "User Updated!",
        });
      });
    } catch (err) {
      console.log("Error", err);
      return res.json(500, {
        message: "Internal Server Error",
      });
    }
  } else {
    return res.status(401).send("Unauthorized");
  }
};

// get own Details
module.exports.userDetails = async function (req, res) {
  try {
    let id = req.user._id;
    let user = USER.findById({ id }, "user date -_id");
    USER.findById(id, function (err, user) {
      if (user) {
        return res.json(200, {
          message: "Own Details:",
          user: user,
        });
      } else {
        return res.json(500, {
          message: "User not found!",
        });
      }
    });
  } catch (err) {
    console.log("Error", err);
    return res.json(500, {
      message: "Internal Server Error",
    });
  }
};

// get all Registered user Details
module.exports.allUser = async function (req, res) {
  try {
    let id = req.user._id;
    let user = USER.findById({ id }, "user date -_id");
    let allUser = await USER.find({});
    USER.findById(id, function (err, user) {
      if (user) {
        return res.json(200, {
          message: "All User Details:",
          data: {
            allUser: allUser,
          },
        });
      } else {
        return res.json(500, {
          message: "User not found!",
        });
      }
    });
  } catch (err) {
    console.log("Error", err);
    return res.json(500, {
      message: "Internal Server Error",
    });
  }
};

module.exports.googleLogin = async function (req, res) {
  let user = USER.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.json(200, {
        message: "Login Successful and here is your token",
        data: {
          jwtToken: jwt.sign(user.toJSON(), process.env.JWTSECRET, { expiresIn: "3d" }),
        },
      });
    } else {
      return res.json(404, {
        message: "User Not found",
      });
    }

  }
  );

};

module.exports.verifyMail = async (req, res) => {
  console.log("backend_SellerOTP-:", req.body)
  var result = [];
  var email = req.body.email;
  var emailotp = "";

  const mail_otp = (mail) => {
    return new Promise((resolve, reject) => {
      USER.findOne({ email: mail }).then((m) => {
        if (m) {
          emailotp = 'Already Signed Up with this email';
          result.push({ about_mail: emailotp })
          resolve(result);
        }
        else {
          let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            auth: {
              user: "Kshitij@propshots.in",
              pass: "propshots@123",
            },
          });
          var val = Math.floor(1000 + Math.random() * 9000);
          let info = transporter.sendMail({
            from: '"Support " <Kshitij@propshots.in>',
            to: mail,
            subject: "OTP to update profile email address.",
            text: "Please use " + val + " as OTP to update your email address.",
          });
          emailotp = val;
          result.push({ about_mail: emailotp })
          resolve(result);
        }
      })
    });
  }

  Promise.all(await mail_otp(email)).then(() => {
    res.send(result)
  });
}

module.exports.welcomeMail = async (req, res) => {
  var result = "";
  var email = "contact@propshots.in";
  // var email = "nktiwarippp@gmail.com";

  const mail_otp = (mail) => {
    return new Promise((resolve, reject) => {
      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        auth: {
          user: "Kshitij@propshots.in",
          pass: "propshots@123",
        },
      });
      let info = transporter.sendMail({
        from: '"Support " <Kshitij@propshots.in>',
        to: mail,
        subject: "Someone wants to Contact Propshots.",
        text: "Person name-:" + req.body.name + ", email-:" + req.body.email + " wants to contact PROPSHOTS.His words for PROPSHOTS are-:" + req.body.desc + "",
      });
      result = "Thanks for contacting us..."
      resolve(result);
    });
  }

  Promise.all(await mail_otp(email)).then(() => {
    res.send(result)
  });
}


module.exports.checkToken = (req, res) => {
  try {
    req.user = jwt.verify(req.body.token, process.env.JWTSECRET)
    res.json(true)
  } catch (e) {
    res.json(false)
  }
}
