const express = require("express");

const router = new express.Router();

router.use("/rent", require("./rent"));

router.use("/issues", require("./issues"));

router.use("/users", require("./users"));

router.use("/activity", require("./viewActivity"));

module.exports = router;
