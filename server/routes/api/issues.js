const express = require("express");
const bodyParser = require("body-parser");
const {
  CREATED,
  BAD_REQUEST,
} = require("http-status-codes");

const redisClient = require("../../persistence/redisClient");
const {
  getIssue,
  getIssues,
  createIssue,
  updateIssue,
  getComments,
  addComment,
  searchIssues,
  getIssueUsers,
  getNewActivity,
} = require("../../persistence/stores/issues");
const {
  markIssueSeen,
  markIssueCommentSeen,
} = require("../../persistence/stores/viewActivity");
const { ensureLoggedIn } = require("../utils");

const router = new express.Router();

const clearUnclosedIssuesCache = async () => {
  if (!redisClient) {
    return;
  }

  await redisClient.del("issues:unclosed");
};

router.route("/")
  .get(
    ensureLoggedIn,
    async (req, res, next) => {
      try {
        let {
          includeClosed,
          since,
        } = req.query;

        includeClosed = !!includeClosed;

        const excludeStatuses = [];

        if (!includeClosed) {
          excludeStatuses.push("closed");
        }

        if (since) {
          since = new Date(since);

          if (isNaN(since.getTime())) {
            const err = new Error("since parameter is not a valid date");
            err.status = BAD_REQUEST;

            return next(err);
          }
        } else {
          since = undefined;
        }

        if (redisClient && !since && !includeClosed) {
          const issueJSON = await redisClient.get("issues:unclosed");

          if (issueJSON) {
            res.type("application/json").send(issueJSON);
            return;
          }
        }

        const issues = await getIssues({
          excludeStatuses,
          userID: req.user.id,
          since,
        });

        if (redisClient && !since && !includeClosed) {
          redisClient.set(
            "issues:unclosed",
            JSON.stringify(issues),
          );
        }

        res.json(issues);
      } catch (ex) {
        next(ex);
      }
    }
  ).post(
    ensureLoggedIn,
    bodyParser.json(),
    async (req, res, next) => {
      const issueData = req.body;

      if (!issueData || Object.keys(issueData).length === 0) {
        const err = new Error("No issue data provided");
        err.status = BAD_REQUEST;

        return next(err);
      }

      try {
        const issue = await createIssue({
          userID: req.user.id,
          issueData,
        });

        await markIssueSeen({
          issueID: issue.id,
          userID: req.user.id,
        });

        await clearUnclosedIssuesCache();

        res
          .status(CREATED)
          .location(`${req.baseUrl}/${issue.id}`)
          .json(issue);
      } catch (ex) {
        next(ex);
      }
    }
  );

router.route("/activity")
  .get(
    ensureLoggedIn,
    async (req, res, next) => {
      try {
        const activity = await getNewActivity({
          userID: req.user.id,
        });

        res.json(activity);
      } catch (ex) {
        next(ex);
      }
    }
  );

router.route("/issueUsers")
  .get(
    ensureLoggedIn,
    async (req, res, next) => {
      const {
        nameFilter,
      } = req.query;

      try {
        const names = await getIssueUsers({ nameFilter });

        res.json(names);
      } catch (ex) {
        next(ex);
      }
    }
  );

router.route("/search")
  .get(
    ensureLoggedIn,
    async (req, res, next) => {
      let { query, status, activityBy } = req.query;

      if (status && !Array.isArray(status)) {
        status = [status];
      }

      if (activityBy) {
        if (!Array.isArray(activityBy)) {
          activityBy = [activityBy];
        }

        if (activityBy.length > 0) {
          activityBy = activityBy.map(
            (user) => JSON.parse(user)
          );
        }
      }

      try {
        const results = await searchIssues({
          query,
          status,
          activityBy,
          userID: req.user.id,
        });

        res.json(results);
      } catch (ex) {
        return next(ex);
      }
    }
  );

router.route("/:issueID")
  .get(
    ensureLoggedIn,
    async (req, res, next) => {
      const issueID = Number(req.params.issueID);

      if (isNaN(issueID)) {
        const err = new Error("Issue ID must be a number");
        err.status = BAD_REQUEST;

        return next(err);
      }

      const includeComments = !!req.query.includeComments;

      try {
        const issue = await getIssue({
          id: issueID,
          userID: req.user.id,
          includeComments,
        });

        res.json(issue);
      } catch (ex) {
        next(ex);
      }
    }
  )
  .patch(
    ensureLoggedIn,
    bodyParser.json(),
    async (req, res, next) => {
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

        await clearUnclosedIssuesCache();

        res.json(issue);
      } catch (ex) {
        next(ex);
      }
    }
  );

router.route("/:issueID/comments")
  .get(
    ensureLoggedIn,
    async (req, res, next) => {
      let { issueID } = req.params;

      issueID = Number(issueID);

      if (isNaN(issueID)) {
        const err = new Error("Must provide an integer issueID parameter");
        err.status = BAD_REQUEST;

        return next(err);
      }

      try {
        const comments = await getComments({
          issueID,
          userID: req.user.id,
        });

        res.json(comments);
      } catch (ex) {
        next(ex);
      }
    }
  )
  .post(
    ensureLoggedIn,
    bodyParser.json(),
    async (req, res, next) => {
      let { issueID } = req.params;

      issueID = Number(issueID);

      if (isNaN(issueID)) {
        const err = new Error("Must provide an integer issueID parameter");
        err.status = BAD_REQUEST;

        return next(err);
      }

      const commentData = req.body;

      if (!commentData || Object.keys(commentData).length === 0) {
        const err = new Error("No comment data provided");
        err.status = BAD_REQUEST;

        return next(err);
      }

      try {
        const comment = await addComment({
          issueID,
          userID: req.user.id,
          commentData,
        });

        await markIssueCommentSeen({
          issueCommentID: comment.id,
          userID: req.user.id,
        });

        res
          .status(CREATED)
          .location(`${req.baseUrl}/${comment.id}`)
          .json(comment);
      } catch (ex) {
        next(ex);
      }
    }
  );

module.exports = router;
