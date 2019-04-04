const express = require("express");
const bodyParser = require("body-parser");
const { BAD_REQUEST } = require("http-status-codes");

const {
  getIssues,
  updateIssue,
} = require("../../persistence/stores/issues");

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

router.route("/:issueID")
  .patch(
    bodyParser.json(),
    async (req, res, next) => {
      if (!req.user) {
        return next(new Error("Must be logged in to update an issue"));
      }

      const issueID = Number(req.params.issueID);

      if (isNaN(issueID)) {
        const err = new Error("Issue ID must be a number");
        err.status = BAD_REQUEST;

        return next(err);
      }

      const updates = req.body;

      if (!updates || Object.keys(updates).length === 0) {
        const err = new Error("No updates specified");
        err.status = BAD_REQUEST;

        return next(err);
      }

      try {
        const issue = await updateIssue({
          issueID,
          userID: req.user.id,
          updates,
        });

        res.json(issue);
      } catch (ex) {
        next(ex);
      }
    }
  );

module.exports = router;
