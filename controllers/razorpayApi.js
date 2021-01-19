require("dotenv").config();
const Razorpay = require("razorpay");
const request = require("request");

const razorInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});

module.exports.createOrder = (req, res) => {
  try {
    const options = {
      amount: 499 * 100,
      currency: "INR",
      receipt: "receipt#1",
      payment_capture: 0, //1
    };
    razorInstance.orders.create(options, async function (err, order) {
      if (err) {
        return res.status(500).json({
          message: "Something error!s",
        });
      }
      return res.status(200).json(order);
    });
  } catch (err) {
    return res.status(500).json({
      message: "Something error!s",
    });
  }
};

module.exports.capturePayment = (req, res) => {
  try {
    return request(
      {
        method: "POST",
        url: `https://${process.env.RAZORPAY_KEY}:${process.env.RAZORPAY_SECRET}@api.razorpay.com/v1/payments/${req.params.paymentId}/capture`,
        form: {
          amount: 499 * 100,
          currency: "INR",
        },
      },
      async function (err, response, body) {
        if (err) {
          return res.status(500).json({
            message: "Something error!s",
          });
        }
        return res.status(200).json(body);
      }
    );
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};
