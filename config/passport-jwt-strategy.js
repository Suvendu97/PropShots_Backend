require("dotenv").config();
const passport = require("passport");

const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;

const USER = require("../models/user");

let opts = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWTSECRET,
};

// authenticate using passport-jwt
passport.use(
  new JWTStrategy(opts, function (jwtPayLoad, done) {

    USER.findById(jwtPayLoad._id, function (err, user) {
      if (err) {
        console.log("Error in finding user");
        return;
      }

      if (user) {
        return done(null, user);
      } else {
        console.log("********************* jwt error");
        return done(null, false);
      }
    });
  })
);

module.exports = passport;
