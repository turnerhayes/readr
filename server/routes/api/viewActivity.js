const express = require("express");
const {
  BAD_REQUEST,
} = require("http-status-codes");

const {
  getNewIssueActivity,
  markIssueSeen,
} = require("../../persistence/stores/viewActivity");
const { ensureLoggedIn } = require("../utils");

const router = new express.Router();

router.route("/issues")
  .get(
    ensureLoggedIn,
    async (req, res, next) => {
      try {
        const activity = await getNewIssueActivity({
          userID: req.user.id,
        });

        res.json(activity);
      } catch (ex) {
        next(ex);
      }
    }
  );


router.route("/issues/:issueID")
  .put(
    ensureLoggedIn,
    async (req, res, next) => {
      let { issueID } = req.params;

      const includeComments = Boolean(req.query.includeComments);

      issueID = Number(issueID);

      if (isNaN(issueID)) {
        const err = new Error("Must provide an integer issueID parameter");
        err.status = BAD_REQUEST;

        return next(err);
      }

      try {
        const marked = await markIssueSeen({
          issueID,
          includeComments,
          userID: req.user.id,
        });

        res.json(marked);
      } catch (ex) {
        next(ex);
      }
    }
  );

module.exports = router;