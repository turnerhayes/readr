const ITEM_TABLES = [
  "issues",
  "issue_comments",
  "rent_payments",
];


exports.up = async function(knex, Promise) {
  await Promise.all(
    ITEM_TABLES.map(
      (itemTable) => {
        return knex.schema.createTable(`${itemTable}_user_views`, (table) => {
          table.integer("user_id").unsigned().notNullable()
            .references("id").inTable("users");
          table.integer("item_id").unsigned().notNullable()
            .references("id").inTable(itemTable);
          table.timestamp("last_seen");
          table.primary(["user_id", "item_id"]);
        });
      }
    )
  );
};

exports.down = async function(knex, Promise) {
  await Promise.all(
    ITEM_TABLES.map(
      (itemTable) => {
        return knex.schema.dropTableIfExists(itemTable);
      }
    )
  );
};
