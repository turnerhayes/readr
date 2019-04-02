const express = require("express");
const { getIssues } = require("../../persistence/stores/issues");

const router = new express.Router();

router.route("/")
  .get(
    async (req, res, next) => {
      try {
        const issues = await getIssues();

        res.json(issues);
      } catch (ex) {
        next(ex);
      }
    }
  );

module.exports = router;
