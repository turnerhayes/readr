const { getDataConnection } = require("../connections");

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

const getIssues = async ({
  ids,
  originMessageIDs,
  excludeStatuses = [],
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

  return query;
};

const getIssue = async ({
  id,
  includeComments = false,
}) => {
  const [issue] = await getIssues({
    ids: [id],
  });

  if (includeComments) {
    const comments = await getComments({
      issueID: id,
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

const getComments = async ({ issueID }) => {
  const connection = await getDataConnection();

  const comments = await connection
    .select(UNALIASED_ISSUE_COMMENT_COLUMNS)
    .select(ALIASED_ISSUE_COMMENT_COLUMNS)
    .from("issue_comments")
    .where({
      issue_id: issueID,
    }).whereNull("deleted_at")
    .orderBy("created_at", "asc");

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

const searchIssues = async ({ query }) => {
  const connection = await getDataConnection();

  query = query.toLowerCase();

  const knexQuery = connection.select(UNALIASED_ISSUE_COLUMNS)
    .select(ALIASED_ISSUE_COLUMNS).from(
      "issues"
    ).whereNull(
      "deleted_at"
    ).where(
      connection.raw("LOWER(description)"), "like", `%${query}%`
    ).orWhere(
      connection.raw("LOWER(body)"), "like", `%${query}%`
    );

  return knexQuery;
};

module.exports = {
  getIssue,
  getIssues,
  createIssue,
  updateIssue,
  getComments,
  addComment,
  searchIssues,
};
