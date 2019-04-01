const express = require("express");

const getAuthenticationRouter = require("./auth");

const router = new express.Router();

router.use(require("./manifest"));

router.use("/api", require("./api"));

router.use(
  "/auth",
  getAuthenticationRouter("/auth")
);

module.exports = router;
