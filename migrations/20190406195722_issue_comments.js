
exports.up = async function(knex, Promise) {
  await knex.schema.createTable("issue_comments", (table) => {
    table.increments("id");
    table.integer("issue_id")
      .references("id")
      .inTable("issues")
      .notNullable();
    table.text("body");
    table.integer("created_by")
      .references("id")
      .inTable("users")
      .notNullable();
    table.integer("updated_by")
      .references("id")
      .inTable("users")
      .notNullable();
    table.timestamps(false, true);
    table.timestamp("deleted_at");
  });
};

exports.down = async function(knex, Promise) {
  await knex.schema.dropTableIfExists("issue_comments");
};
