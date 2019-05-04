const { getDataConnection } = require("../connections");
const { addLastSeenQuery } = require("./utils");

const UNALIASED_ISSUE_COLUMNS = [
  "id",
  "description",
  "body",
  "status",
];


const ALIASED_ISSUE_COLUMNS = {
  originMessageID: "origin_message_id",
  createdAt: "created_at",
  updatedAt: "updated_at",
  createdBy: "created_by",
  createdByText: "created_by_text",
  updatedBy: "updated_by",
  updatedByText: "updated_by_text",
};

const UNALIASED_ISSUE_COMMENT_COLUMNS = [
  "id",
  "body",
];


const ALIASED_ISSUE_COMMENT_COLUMNS = {
  createdAt: "created_at",
  updatedAt: "updated_at",
  createdBy: "created_by",
  updatedBy: "updated_by",
};

const transformResultToIssue = (result) => {
  for (const alias of Object.keys(ALIASED_ISSUE_COLUMNS)) {
    const aliasedName = ALIASED_ISSUE_COLUMNS[alias];

    if (aliasedName in result) {
      result[alias] = result[aliasedName];
      delete result[aliasedName];
    }
  }

  if (result.newCommentIDs === null) {
    result.newCommentIDs = [];
  }

  delete result.originMessageID;

  return result;
};

const transformResultToIssueComment = (result) => {
  for (const alias of Object.keys(ALIASED_ISSUE_COMMENT_COLUMNS)) {
    const aliasedName = ALIASED_ISSUE_COMMENT_COLUMNS[alias];

    if (aliasedName in result) {
      result[alias] = result[aliasedName];
      delete result[aliasedName];
    }
  }

  return result;
};

const addIssueLastSeenQuery = ({
  connection,
  query,
  userID,
}) => {
  if (userID) {
    query = addLastSeenQuery({
      connection,
      query,
      userID,
      itemTable: "issues",
    }).select({
      "newCommentIDs": connection.select(
        connection.raw("array_agg(comment_last_seen_data.comment_id)")
      ).from(
        (builder) => builder.select({
          "comment_id": "issue_comments.id",
        }).select(
          "issue_comments_user_views.last_seen"
        ).from("issue_comments")
          .leftOuterJoin(
            "issue_comments_user_views",
            (onBuilder) => onBuilder.on(
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
          ).whereNull("issue_comments.deleted_at")
          .where({
            "issue_comments.issue_id": connection.ref("issues.id"),
          }).as("comment_last_seen_data")
      )
        .whereNull("comment_last_seen_data.last_seen"),
    });
  }

  return query;
};

const getIssues = async ({
  ids,
  originMessageIDs,
  excludeStatuses = [],
  userID,
} = {}) => {
  const connection = await getDataConnection();

  let query = connection.select(UNALIASED_ISSUE_COLUMNS)
    .select(ALIASED_ISSUE_COLUMNS).from(
      "issues"
    ).whereNull(
      "deleted_at"
    ).orderBy([
      "status",
      {
        column: "updated_at",
        order: "desc",
      },
    ]);

  if (ids && ids.length > 0) {
    if (ids.length === 1) {
      query = query.where({
        id: ids[0],
      });
    } else {
      query = query.whereIn("id", ids);
    }
  }

  if (originMessageIDs && originMessageIDs.length > 0) {
    if (originMessageIDs.length === 1) {
      query = query.where({
        origin_message_id: originMessageIDs[0],
      });
    } else {
      query = query.whereIn(
        "origin_message_id",
        originMessageIDs
      );
    }
  }

  if (excludeStatuses && excludeStatuses.length > 0) {
    if (excludeStatuses.length === 1) {
      query = query.whereNot("status", excludeStatuses[0]);
    }
    query = query.whereNotIn(
      "status",
      excludeStatuses,
    );
  }

  query = addIssueLastSeenQuery({
    connection,
    query,
    userID,
  });

  const issues = await query;

  return issues.map(transformResultToIssue);
};

const getIssue = async ({
  id,
  includeComments = false,
  userID,
}) => {
  const [issue] = await getIssues({
    ids: [id],
    userID,
  });

  if (includeComments) {
    const comments = await getComments({
      issueID: id,
      userID,
    });

    issue.comments = comments;
  }

  return issue;
};

const createIssue = async ({
  userID,
  creatorText,
  issueData: {
    description,
    body,
    originMessageID,
  },
}) => {
  if (userID === undefined && !creatorText) {
    throw new Error(
      "Cannot create an issue without specifying either a `userID` or a " +
      "`creatorText` parameter"
    );
  }

  const connection = await getDataConnection();

  const [issue] = await connection.insert({
    description,
    body,
    status: "new",
    origin_message_id: originMessageID,
    created_by: userID,
    updated_by: userID,
    created_by_text: creatorText,
    updated_by_text: creatorText,
  }).into("issues").returning("*");

  return transformResultToIssue(issue);
};

const updateIssue = async ({
  issueID,
  userID,
  updates: {
    body,
    description,
    status,
  },
}) => {
  if (!userID) {
    throw new Error("User ID required to update an issue");
  }

  const connection = await getDataConnection();

  const [issue] = await connection("issues")
    .update({
      body,
      description,
      status,
      updated_at: connection.fn.now(),
      updated_by: userID,
    }).where({
      id: issueID,
    }).returning("*");

  if (!issue) {
    throw new Error(`No issue with ID ${issueID} found`);
  }

  return transformResultToIssue(issue);
};

const getComments = async ({ issueID, userID }) => {
  const connection = await getDataConnection();

  const query = addLastSeenQuery({
    connection,
    userID,
    itemTable: "issue_comments",
    query: connection
      .select(UNALIASED_ISSUE_COMMENT_COLUMNS)
      .select(ALIASED_ISSUE_COMMENT_COLUMNS)
      .from("issue_comments")
      .where({
        issue_id: issueID,
      }).whereNull("deleted_at")
      .orderBy("created_at", "asc"),
  });

  const comments = await query;

  return comments.map(transformResultToIssueComment);
};

const addComment = async ({
  issueID,
  userID,
  commentData: {
    body,
  },
}) => {
  if (userID === undefined) {
    throw new Error("addComment requires a userID parameter");
  }

  if (issueID === undefined) {
    throw new Error("addComment requires a issueID parameter");
  }

  if (!body) {
    throw new Error("addComment requires a body in the commentData");
  }

  const connection = await getDataConnection();

  const [comment] = await connection
    .insert({
      body,
      issue_id: issueID,
      created_by: userID,
      updated_by: userID,
    })
    .into("issue_comments")
    .returning("*");

  return transformResultToIssueComment(comment);
};

const searchIssues = async ({
  query,
  status,
  activityBy,
  userID,
}) => {
  if (
    !query &&
    (
      !status ||
      status.length === 0
    ) &&
    (
      !activityBy ||
      activityBy.length === 0
    )
  ) {
    throw new Error(
      "No search criteria specified"
    );
  }

  const connection = await getDataConnection();

  let knexQuery = connection.select(UNALIASED_ISSUE_COLUMNS)
    .select(ALIASED_ISSUE_COLUMNS).from(
      "issues"
    ).whereNull(
      "deleted_at"
    );

  if (query) {
    query = query.toLowerCase();

    knexQuery = knexQuery.where(
      function(builder) {
        return builder.where(
          connection.raw(
            "LOWER(description)"
          ),
          "like",
          `%${query}%`
        ).orWhere(
          connection.raw(
            "LOWER(body)"
          ),
          "like",
          `%${query}%`
        );
      }
    );
  }

  if (status && status.length > 0) {
    if (status.length === 1) {
      knexQuery = knexQuery.where({
        status: status[0],
      });
    } else {
      knexQuery = knexQuery.whereIn(
        "status",
        status
      );
    }
  }

  if (activityBy && activityBy.length > 0) {
    knexQuery = knexQuery.where(
      (builder) => {
        let subQuery;

        const registeredUsers = [];
        const freetext = [];

        for (const { id, text } of activityBy) {
          if (id !== undefined) {
            registeredUsers.push(id);
          } else {
            freetext.push(text);
          }
        }

        if (freetext.length === 1) {
          subQuery = builder.where({
            created_by_text: freetext[0],
          }).orWhere({
            updated_by_text: freetext[0],
          });
        } else if (freetext.length > 1) {
          subQuery = builder.whereIn(
            "created_by_text",
            freetext
          ).orWhere(
            "updated_by_text",
            freetext
          );
        }

        if (registeredUsers.length === 1) {
          if (subQuery) {
            subQuery = subQuery.orWhere({
              "created_by": registeredUsers[0],
            });
          } else {
            subQuery = builder.where({
              "created_by": registeredUsers[0],
            });
          }
          subQuery = subQuery.orWhere({
            "updated_by": registeredUsers[0],
          }).orWhereExists(
            connection.select().from("issue_comments")
              .where({
                "issue_comments.issue_id": connection.ref("issues.id"),
              }).where(
                (builder) => {
                  return builder.where({
                    "issue_comments.created_by": registeredUsers[0],
                  }).orWhere({
                    "issue_comments.updated_by": registeredUsers[0],
                  });
                }
              )
          );
        } else if (registeredUsers.length > 1) {
          subQuery = subQuery.orWhereIn(
            "created_by",
            registeredUsers
          ).orWhereIn(
            "updated_by",
            registeredUsers
          ).orWhereExists(
            connection.select().from("issue_comments")
              .where({
                "issue_comments.issue_id": connection.ref("issues.id"),
              }).where(
                (builder) => {
                  return builder.whereIn(
                    "issue_comments.created_by",
                    registeredUsers
                  ).orWhereIn(
                    "issue_comments.updated_by",
                    registeredUsers
                  );
                }
              )
          );
        }

        return subQuery;
      }
    );
  }

  knexQuery = addIssueLastSeenQuery({
    connection,
    query: knexQuery,
    itemTable: "issues",
    userID,
  });

  return knexQuery;
};

const getIssueUsers = async ({
  nameFilter,
}) => {
  const connection = await getDataConnection();

  if (nameFilter) {
    nameFilter = nameFilter.toLowerCase();
  }

  const getUserIDSubQuery = (columnName, tableName) => {
    let subquery = connection.select({
      userID: "users.id",
      firstName: "first_name",
      middleName: "middle_name",
      lastName: "last_name",
      displayName: "display_name",
      text: connection.raw("null"),
    }).from(tableName).join(
      "users",
      "users.id",
      "=",
      tableName + "." + columnName
    )
      .whereNull(tableName + ".deleted_at")
      .whereNull("users.deleted_at")
      .whereNotNull(tableName + "." + columnName);

    if (nameFilter) {
      subquery = subquery.where(
        connection.raw("LOWER(users.first_name)"),
        "like",
        `%${nameFilter}%`
      ).orWhere(
        connection.raw("LOWER(users.middle_name)"),
        "like",
        `%${nameFilter}%`
      ).orWhere(
        connection.raw("LOWER(users.last_name)"),
        "like",
        `%${nameFilter}%`
      ).orWhere(
        connection.raw("LOWER(users.display_name)"),
        "like",
        `%${nameFilter}%`
      );
    }

    return subquery;
  };

  const getTextSubquery = (columnName) => {
    let query = connection.select({
      userID: connection.raw("null"),
      firstName: connection.raw("null"),
      middleName: connection.raw("null"),
      lastName: connection.raw("null"),
      displayName: connection.raw("null"),
      text: columnName,
    }).from("issues").whereNull("deleted_at")
      .whereNotNull(columnName);

    if (nameFilter) {
      query = query.where(
        connection.raw(`LOWER(${columnName})`),
        "like",
        `%${nameFilter}%`
      );
    }

    return query;
  };

  const results = await connection.distinct(
    "userID",
    "text",
    "firstName",
    "middleName",
    "lastName",
    "displayName",
  ).from(
    // This weird syntax seems to be the only way to get Knex
    // to generate a proper subquery as the from table
    {
      issue_users: getUserIDSubQuery("created_by", "issues")
        .unionAll(
          getUserIDSubQuery("updated_by", "issues")
        ).unionAll(
          getUserIDSubQuery("created_by", "issue_comments")
        ).unionAll(
          getUserIDSubQuery("updated_by", "issue_comments")
        ).unionAll(
          getTextSubquery("created_by_text")
        ).unionAll(
          getTextSubquery("updated_by_text")
        ),
    }
  );

  return results.map(
    ({ userID, text, displayName, firstName, middleName, lastName }) => {
      if (text !== null) {
        return { text };
      }

      if (displayName !== null) {
        return {
          id: userID,
          name: displayName,
        };
      }

      return {
        id: userID,
        name: [
          firstName,
          middleName,
          lastName,
        ].filter((name) => name).join(" "),
      };
    }
  );
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

  const { rows: [{ item_id: issueIDs }] } = await query;

  if (issueIDs.length === 0) {
    return null;
  }

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

  return {
    issues: issueIDs,
    // eslint-disable-next-line camelcase
    issueComments: comments && comments.map(({ item_id }) => item_id),
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
      last_seen = EXCLUDED.last_seen`,
    {
      insertQuery: connection.insert({
        item_id: issueCommentID,
        user_id: userID,
        last_seen: connection.fn.now(),
      }).into("issue_comments_user_views"),
    }
  );

  await query;

  return {
    issueComments: [
      issueCommentID,
    ],
  };
};

module.exports = {
  getIssue,
  getIssues,
  createIssue,
  updateIssue,
  getComments,
  addComment,
  searchIssues,
  getIssueUsers,
  markIssueSeen,
  markIssueCommentSeen,
};
