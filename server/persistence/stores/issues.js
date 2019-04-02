const { getDataConnection } = require("../connections");

const getIssues = async () => {
  const connection = await getDataConnection();

  return await connection.select(
    "id",
    "description",
    "status",
  ).select({
    createdAt: "created_at",
    updatedAt: "updated_at",
    createdBy: "created_by",
    createdByUserID: "created_by_user_id",
    updatedBy: "updated_by",
    updatedByUserID: "updated_by_user_id",
  }).from(
    "issues"
  ).whereNull(
    "deleted_at"
  );
};

module.exports = {
  getIssues,
};
