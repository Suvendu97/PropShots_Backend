const express = require("express");
const router = express.Router();
const passport = require("passport");

const userRequests = require("../../../controllers/userApi");
const otpController = require("../../../controllers/otpController");

// post req for registering user
router.post("/register", userRequests.createUser);
router.post("/otp", otpController.generate);
router.post("/resendotp", otpController.resend);
router.post("/verifyMail",userRequests.verifyMail);
router.post("/welcome_mail",userRequests.welcomeMail);

// authenticated login request for
router.post("/login", otpController.verify);
router.put("/update", passport.authenticate("jwt", { session: false }), userRequests.update);

router.post("/checkToken", userRequests.checkToken);

router.get("/userDetails", passport.authenticate("jwt", { session: false }), userRequests.userDetails);
router.get("/allUser", passport.authenticate("jwt", { session: false }), userRequests.allUser);
// router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
// router.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "../../../../propshots.in" }), userRequests.createSession);
router.post("/auth/googleLogin", userRequests.googleLogin);

module.exports = router;
