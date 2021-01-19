const passport = require("passport");
// requiring passport-google-strategy
const googleStrategy = require("passport-google-oauth").OAuth2Strategy;
const User = require("../models/user");
require("dotenv").config();

// setting up passport-google-oauth2
passport.use(
  new googleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK,
    },

    function (accessToken, refreshToken, profile, done) {
      console.log("in google auth 1");
      // find a user ..
      User.findOne({ email: profile.emails[0].value }).exec(function (err, user) {
        console.log("in google auth 2");
        if (err) {
          console.log("error in google strategy-passport", err);
          return;
        }

        console.log(profile);

        if (user) {
          console.log(user);
          // if found, set this user as req.user
          return done(null, user);
        } else {
          // if not found create the user and set it as req.user
          return done(null, null);
        }
      });
    }
  )
);

module.exports = passport;
