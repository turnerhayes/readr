const express = require("express");
const bodyParser = require("body-parser");
const {
  CREATED,
  BAD_REQUEST,
} = require("http-status-codes");

const {
  getIssue,
  getIssues,
  createIssue,
  updateIssue,
  getComments,
  addComment,
  searchIssues,
} = require("../../persistence/stores/issues");
const { ensureLoggedIn } = require("../utils");

const router = new express.Router();

router.route("/")
  .get(
    ensureLoggedIn,
    async (req, res, next) => {
      try {
        let {
          includeClosed,
        } = req.query;

        includeClosed = !!includeClosed;

        const excludeStatuses = [];

        if (!includeClosed) {
          excludeStatuses.push("closed");
        }

        const issues = await getIssues({
          excludeStatuses,
        });

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

        res
          .status(CREATED)
          .location(`${req.baseUrl}/${issue.id}`)
          .json(issue);
      } catch (ex) {
        next(ex);
      }
    }
  );

router.route("/search")
  .get(
    async (req, res, next) => {
      const { query } = req.query;

      try {
        const results = await searchIssues({
          query,
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
        const comments = await getComments({ issueID });

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
