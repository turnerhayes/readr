const express = require("express");

const { ensureLoggedIn } = require("../utils");
const { getSnowDays } = require("../../persistence/stores/weather");

const router = new express.Router();

router.route("/snow-alerts")
  .get(
    ensureLoggedIn,
    async (req, res, next) => {
      try {
        const snowDays = await getSnowDays();

        res.json(snowDays);
      } catch (ex) {
        next(ex);
      }
    }
  );


module.exports = router;
