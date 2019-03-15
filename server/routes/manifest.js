"use strict";

const express = require("express");

const router = new express.Router();

router.route("/manifest.json")
  .get(
    (req, res) => {
      res.json({
        short_name: "Fief",
        name: "Fief",
        start_url: "/",
        display: "standalone",
      });
    }
  );

module.exports = router;
