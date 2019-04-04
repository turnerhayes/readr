const { getDataConnection } = require("../connections");

const SELECT_ALIASES = {
  id: "id",
  description: "description",
  body: "body",
  status: "status",
  createdAt: "created_at",
  updatedAt: "updated_at",
  createdBy: "created_by",
  createdByText: "created_by_text",
  updatedBy: "updated_by",
  updatedByText: "updated_by_text",
};

const getIssues = async ({ ids } = {}) => {
  const connection = await getDataConnection();

  let query = connection.select(SELECT_ALIASES).from(
    "issues"
  ).whereNull(
    "deleted_at"
  );

  if (ids && ids.length > 0) {
    query = query.whereIn("id", ids);
  }

  return query;
};

const updateIssue = async ({
  issueID,
  userID,
  updates: {
    body,
    description,
    name: {
      /* eslint-disable camelcase */
      first: first_name,
      middle: middle_name,
      last: last_name,
      display: display_name,
      /* eslint-enable camelcase */
    } = {},
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
      first_name,
      middle_name,
      last_name,
      display_name,
      updated_at: connection.fn.now(),
      updated_by: userID,
    }).where({
      id: issueID,
    }).returning("*");

  if (!issue) {
    throw new Error(`No issue with ID ${issueID} found`);
  }

  for (const alias of Object.keys(SELECT_ALIASES)) {
    if (alias !== SELECT_ALIASES[alias]) {
      issue[alias] = issue[SELECT_ALIASES[alias]];
      delete issue[SELECT_ALIASES[alias]];
    }
  }

  return issue;
};

module.exports = {
  getIssues,
  updateIssue,
};
