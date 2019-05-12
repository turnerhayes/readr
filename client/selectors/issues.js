import { List, Set } from "immutable";

import { getUsers } from "+app/selectors/users";

const ISSUE_FIELDS_WITH_USER_IDS = [
  "createdBy",
  "updatedBy",
];

export const getIssueComments = (state, { issueID }) => {
  const issueComments = state.issues.getIn(
    [
      "items",
      issueID,
      "comments",
    ]
  );

  if (!issueComments || issueComments.isEmpty()) {
    return List();
  }

  const userIDs = issueComments.reduce(
    (ids, comment) => ids.add(
      comment.get("createdBy"),
      comment.get("updatedBy"),
    ),
    Set()
  );

  const users = getUsers(state, { ids: userIDs });

  return issueComments.map(
    (comment) => comment.merge({
      createdBy: users.get(comment.get("createdBy")),
      updatedBy: users.get(comment.get("updatedBy")),
    })
  );
};

export const getIssue = (state, { id }) => {
  let issue = state.issues.getIn(
    [
      "items",
      id,
    ],
    null
  );

  if (issue === null) {
    return null;
  }

  for (const prop of ISSUE_FIELDS_WITH_USER_IDS) {
    const userID = issue.get(prop, null);

    if (userID === null) {
      continue;
    }

    issue = issue.set(
      prop,
      state.users.getIn(
        [
          "items",
          userID,
        ],
        null
      )
    );
  }

  issue = issue.set(
    "comments",
    getIssueComments(state, { issueID: id })
  );

  return issue;
};

export const getLatestIssueUpdateDate = (state) => state.issues.get("items")
  .reduce(
    (latest, issue) => {
      if (latest === null || issue.get("updatedAt") > latest) {
        return issue.get("updatedAt");
      }

      return latest;
    },
    null
  );
