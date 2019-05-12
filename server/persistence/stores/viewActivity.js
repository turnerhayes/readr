const { getDataConnection } = require("../connections");

const getNewIssueActivity = async ({ userID }) => {
  const connection = await getDataConnection();

  const query = connection.select({
    "issueID": "issues.id",
    "isNew": connection.raw("issues_user_views IS NULL"),
    "newCommentIDs": connection.raw("new_comments.ids || '{}'"),
  }).from("issues")
    .leftOuterJoin(
      "issues_user_views",
      (builder) => builder.on(
        "issues_user_views.item_id",
        "=",
        "issues.id"
      ).andOn(
        "issues_user_views.last_seen",
        ">=",
        "issues.updated_at"
      ).andOn(
        "issues_user_views.user_id",
        "=",
        userID
      )
    ).leftOuterJoin(
      (builder) => builder.select(
        "comment_seen_data.issue_id",
        connection.raw("array_agg(comment_seen_data.comment_id) AS ids")
      ).from(
        (builder) => builder.select({
          "comment_id": "issue_comments.id",
        }).select(
          "issue_comments.issue_id",
          "issue_comments_user_views.last_seen"
        ).from("issue_comments")
          .leftOuterJoin(
            "issue_comments_user_views",
            (builder) => builder.on(
              "issue_comments_user_views.item_id",
              "=",
              "issue_comments.id"
            ).andOn(
              "issue_comments_user_views.user_id",
              "=",
              userID
            ).andOn(
              "issue_comments_user_views.last_seen",
              ">=",
              "issue_comments.updated_at"
            )
          )
          .whereNull("issue_comments.deleted_at")
          .as("comment_seen_data")
      ).groupBy("comment_seen_data.issue_id")
        .as("new_comments"),
      "new_comments.issue_id",
      "=",
      "issues.id"
    ).whereNull("issues.deleted_at")
    .andWhere(
      (builder) => builder.whereNull("issues_user_views.last_seen")
        .orWhereNotNull("new_comments.ids")
    );

  const results = await query;

  if (results.length === 0) {
    return null;
  }

  const newActivity = {};

  for (const result of results) {
    if (result.isNew) {
      if (!newActivity.issues) {
        newActivity.issues = [];
      }

      newActivity.issues.push(result.issueID);
    }

    if (result.newCommentIDs.length > 0) {
      if (!newActivity.issueComments) {
        newActivity.issueComments = {};
      }

      newActivity.issueComments[result.issueID] = result.newCommentIDs;
    }
  }

  return newActivity;
};

const markIssueSeen = async ({
  issueID,
  userID,
  includeComments = false,
}) => {
  const connection = await getDataConnection();

  const values = {
    user_id: userID,
    item_id: issueID,
    last_seen: connection.fn.now(),
  };

  const insertQuery = connection.insert(values)
    .into("issues_user_views");

  let query = connection.raw(
    `:insertQuery ON CONFLICT (item_id, user_id) DO UPDATE SET
      last_seen = EXCLUDED.last_seen
      returning item_id
    `,
    {
      insertQuery,
    }
  );

  await query;

  let comments;

  if (includeComments) {
    query = connection.raw(
      `:insertQuery ON CONFLICT (item_id, user_id) DO UPDATE SET
      last_seen = EXCLUDED.last_seen
      returning item_id`,
      {
        insertQuery: connection.raw(
          `INSERT INTO "issue_comments_user_views"
          (item_id, user_id, last_seen)
          :selectQuery`,
          {
            selectQuery: connection.select({
              "item_id": "issue_comments.id",
            }).select(
              connection.raw("? as user_id", userID),
              connection.raw("? as last_seen", values.last_seen),
            ).from("issue_comments")
              .where({
                "issue_comments.issue_id": issueID,
              }),
          }
        ),
      }
    );

    ({ rows: comments } = await query);
  }

  const markedComments = {};

  if (comments) {
    // eslint-disable-next-line camelcase
    markedComments[issueID] = comments.map(({ item_id }) => item_id);
  }

  return {
    issues: [issueID],
    issueComments: markedComments,
  };
};

const markIssueCommentSeen = async ({
  issueCommentID,
  userID,
}) => {
  const connection = await getDataConnection();

  const query = connection.raw(
    `:insertQuery ON CONFLICT (item_id, user_id) DO
    UPDATE SET
      last_seen = EXCLUDED.last_seen
    returning *`,
    {
      insertQuery: connection.insert({
        item_id: issueCommentID,
        user_id: userID,
        last_seen: connection.fn.now(),
      }).into("issue_comments_user_views"),
    }
  );

  const { rows: [comment] } = await query;

  return {
    issueComments: {
      [comment.issue_id]: [
        issueCommentID,
      ],
    },
  };
};

module.exports = {
  getNewIssueActivity,
  markIssueSeen,
  markIssueCommentSeen,
};
