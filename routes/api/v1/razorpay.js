const express = require("express"),
  router = express.Router(),
  paymentRequest = require("../../../controllers/razorpayApi");

router.get("/order", paymentRequest.createOrder);

router.post("/capture/:paymentId", paymentRequest.capturePayment);

module.exports = router;
