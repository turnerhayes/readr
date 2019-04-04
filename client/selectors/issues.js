const ISSUE_FIELDS_WITH_USER_IDS = [
  "createdBy",
  "updatedBy",
];

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

  return issue;
};
