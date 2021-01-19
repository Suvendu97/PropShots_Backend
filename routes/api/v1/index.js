const express = require("express");
const router = express.Router();
const listApi = require("../../../controllers/listApi");

router.use("/users", require("./users"));
router.use("/property", require("./property"));
router.use("/ignore", require("./ignoredList"));
router.use("/shortlist", require("./shortlist"));
router.use("/razorpay", require("./razorpay"));
router.get("/getStates", listApi.getState);
router.get("/getCities", listApi.getCityOfState);
router.get("/createStates", listApi.createState);
router.get("/createCities", listApi.createCity);

module.exports = router;
