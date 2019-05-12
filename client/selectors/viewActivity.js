import { createSelector } from "reselect";
import { Map, List } from "immutable";

export const newActivity = (state) => {
  return state.viewActivity;
};

/**
 * Returns a copy of `state` that has removed any new comments
 * whose issue is also new (that is, no issue will appear in
 * both the issues and issueComments properties).
 *
 * @param {{viewActivity: Immutable.Map}} state the state to dedupe
 *
 * @return {object}
 */
export const stateWithDedupedActivity = (state) => {
  const {
    viewActivity,
    ...otherState
  } = state;

  // If no new issueComments, nothing to dedupe, so return the
  // same object.
  if (viewActivity.get("issueComments", Map())) {
    return state;
  }

  return {
    viewActivity: viewActivity.updateIn(
      [
        "issueComments",
      ],
      (issueComments) => {
        if (!issueComments) {
          return issueComments;
        }

        return issueComments.filter(
          (ids, issueID) => !viewActivity.get("issues", List())
            .includes(issueID)
        );
      }
    ),
    ...otherState,
  };
};

export const newIssueCount = createSelector(
  newActivity,
  (activity) => activity.get("issues", List()).size
);

export const newCommentCount = createSelector(
  newActivity,
  (activity) => activity.get("issueComments", Map()).size
);

export const linkURLForNewIssues = createSelector(
  newActivity,
  (activity) => {
    const issues = activity.get("issues", List());

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
  (activity) => {
    const comments = activity.get("issueComments", Map());

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
