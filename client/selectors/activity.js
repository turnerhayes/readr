import { createSelector } from "reselect";
import { OrderedMap } from "immutable";

export const newActivity = (state, { dedupe = false } = {}) => {
  const allIssues = state.issues.get("items", OrderedMap());

  let issues = OrderedMap();
  let comments = OrderedMap();

  allIssues.forEach(
    (issue, issueID) => {
      if (issue.get("hasNew")) {
        issues = issues.set(issueID, issue);
      }
      if (!issue.get("newCommentIDs").isEmpty()) {
        comments = comments.set(issueID, issue.get("newCommentIDs"));
      }
    }
  );

  if (dedupe) {
    // Remove any comments for new issues
    comments = comments.filter(
      (ids, issueID) => !issues.has(issueID)
    );
  }

  return {
    issues,
    comments,
  };
};

export const linkURLForNewIssues = createSelector(
  newActivity,
  ({ issues }) => {
    if (issues.isEmpty()) {
      return null;
    }

    if (issues.size === 1) {
      const issueID = issues.keySeq().first();

      return `/issues/${issueID}`;
    }

    return "/issues";
  }
);

export const linkURLForNewComments = createSelector(
  newActivity,
  ({ comments }) => {
    if (comments.isEmpty()) {
      return null;
    }

    if (comments.size === 1) {
      const issueID = comments.keySeq().first();

      return `/issues/${issueID}?comment=${comments.get(issueID).first()}`;
    }

    return "/issues";
  }
);
