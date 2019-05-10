const express = require("express");

const Config = require("../../config");

const router = new express.Router();

router.use("/rent", require("./rent"));

router.use("/issues", require("./issues"));

router.use("/users", require("./users"));

router.use("/activity", require("./viewActivity"));


if (
  Config.weather.openWeatherMapAPIKey &&
  Config.property.location
) {
  router.use("/weather", require("./weather"));
}

module.exports = router;
