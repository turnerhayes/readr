const { getDataConnection } = require("../connections");

const UNALIASED_ISSUE_COLUMNS = [
  "id",
  "description",
  "body",
  "status",
];


const ALIASED_ISSUE_COLUMNS = {
  createdAt: "created_at",
  updatedAt: "updated_at",
  createdBy: "created_by",
  createdByText: "created_by_text",
  updatedBy: "updated_by",
  updatedByText: "updated_by_text",
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

const getIssues = async ({ ids } = {}) => {
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
    query = query.whereIn("id", ids);
  }

  return query;
};

const createIssue = async ({
  userID,
  issueData: {
    description,
    body,
  },
}) => {
  if (userID === undefined) {
    throw new Error("Cannot create an issue without specifying a userID");
  }

  const connection = await getDataConnection();

  const [issue] = await connection.insert({
    description,
    body,
    status: "new",
    created_by: userID,
    updated_by: userID,
  }).into("issues").returning("*");

  return transformResultToIssue(issue);
};

const updateIssue = async ({
  issueID,
  userID,
  updates: {
    body,
    description,
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

module.exports = {
  getIssues,
  createIssue,
  updateIssue,
};
