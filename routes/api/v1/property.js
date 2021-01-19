const express = require("express"),
  router = express.Router({ mergeParams: true }),
  passport = require("passport"),
  propertyRequests = require("../../../controllers/propertyApi");

router
  .route("/")
  .get(passport.authenticate("jwt", { session: false }), propertyRequests.getAllProperties)
  .post(passport.authenticate("jwt", { session: false }), propertyRequests.postProperty);

router.route("/myProperties").get(passport.authenticate("jwt", { session: false }), propertyRequests.getUserProperties);


router
  .route("/:id")
  .put(passport.authenticate("jwt", { session: false }), propertyRequests.updateProperty)
  .delete(passport.authenticate("jwt", { session: false }), propertyRequests.deleteProperty);

  // router.get("/filter", passport.authenticate("jwt", { session: false }), propertyRequests.filter);

module.exports = router;
