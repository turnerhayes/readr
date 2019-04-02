const express = require("express");

const router = new express.Router();

router.use("/rent", require("./rent"));

router.use("/issues", require("./issues"));

module.exports = router;
