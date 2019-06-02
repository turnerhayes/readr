const path = require("path");
const express = require("express");

const Config = require("../config");

const getAuthenticationRouter = require("./auth");

const router = new express.Router();

router.use(require("./manifest"));

router.use("/api", require("./api"));

router.use("/samples", express.static(
  path.resolve(Config.paths.client, "samples")
));

router.use(
  "/auth",
  getAuthenticationRouter("/auth")
);

module.exports = router;
