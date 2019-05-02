const addLastSeenQuery = ({
  connection,
  query,
  itemTable,
  userID,
}) => {
  if (userID) {
    const viewTable = `${itemTable}_user_views`;
    query = query.leftOuterJoin(
      viewTable,
      function() {
        // eslint-disable-next-line babel/no-invalid-this
        return this.on(
          `${viewTable}.item_id`,
          "=",
          `${itemTable}.id`,
        ).andOn(
          `${viewTable}.user_id`,
          "=",
          userID,
        );
      }
    ).select({
      "lastSeen": `${viewTable}.last_seen`,
      "hasNew": connection.raw(
        `(
          ${viewTable}.last_seen is null OR
          ${viewTable}.last_seen < ${itemTable}.updated_at
        )`
      ),
    });
  }

  return query;
};

module.exports = {
  addLastSeenQuery,
};
