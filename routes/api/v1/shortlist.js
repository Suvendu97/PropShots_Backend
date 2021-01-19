const express = require("express"),
  router = express.Router({ mergeParams: true }),
  passport = require("passport"),
  shortlistRequests = require("../../../controllers/shortlistApi"),
  phoneNoApi = require("../../../controllers/phoneNoApi");

router.get("/", passport.authenticate("jwt", { session: false }), shortlistRequests.getShortlist);
router.get("/getShortListedData/:id", passport.authenticate("jwt", { session: false }), shortlistRequests.getShortlistedData);

// router.get("/:id", passport.authenticate("jwt", { session: false }), shortlistRequests.shortlistDetail);

router.get("/add/:id", passport.authenticate("jwt", { session: false }), shortlistRequests.addToShortlist);
router.get("/remove/:id", passport.authenticate("jwt", { session: false }), shortlistRequests.removeFromShortlist);
router.get("/send", passport.authenticate("jwt", { session: false }), phoneNoApi.send);
router.get("/resend", passport.authenticate("jwt", { session: false }), phoneNoApi.resend);
router.get("/getphone", passport.authenticate("jwt", { session: false }), phoneNoApi.verify);

module.exports = router;
