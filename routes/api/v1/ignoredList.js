const express = require("express");
const router = express.Router({ mergeParams: true });
const passport = require("passport");

const ignoredController = require("../../../controllers/ignoredListApi");

router.get("/:id/add", passport.authenticate("jwt", { session: false }), ignoredController.add);
router.delete("/:id/remove", passport.authenticate("jwt", { session: false }), ignoredController.remove);
// router.get("/:id/IgnoredList", passport.authenticate("jwt", { session: false }), ignoredController.IgnoredList);

module.exports = router;
