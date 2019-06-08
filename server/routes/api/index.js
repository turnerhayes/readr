const express = require("express");

const router = new express.Router();

router.use("/users", require("./users"));

router.use("/epub", require("./epub"));

module.exports = router;
