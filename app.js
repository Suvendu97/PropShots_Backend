require("dotenv").config(); //for environment variable
const mongoose = require("mongoose");
const express = require("express");
const app = express();
// const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const PropertyId = require("./models/propertId");
const cors = require("cors");

const passport = require("passport");

const session = require("express-session");

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
app.use(cors());

app.get("/api/check", (req, res) => {
  res.status(200).send({
    status: "OK",
  });
});

app.use(
  session({
    secret: "abcdefg",
    resave: true,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

const db = require("./config/mongoose");
const passportJWT = require("./config/passport-jwt-strategy");
// routes for user
app.use("/api", require("./routes/api"));
const passportGoogle = require("./config/passport-google-oauth2-strategy");

//server port
const port = process.env.PORT || 8000;

//starting server
app.listen(port, () => {
  console.log(`app is running at ${port}`);
});
