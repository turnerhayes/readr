exports.up = async function(knex, Promise) {
  await knex.schema.createTable("issues", (table) => {
    table.increments("id");
    table.string("description").notNullable();
    table.text("body");
    table.string("created_by").notNullable();
    table.integer("created_by_user_id")
      .references("id")
      .inTable("users");
    table.string("updated_by").notNullable();
    table.integer("updated_by_user_id")
      .references("id")
      .inTable("users");
    table.string("status").notNullable();
    table.timestamps(false, true);
    table.timestamp("deleted_at");
  });
};

exports.down = async function(knex, Promise) {
  await knex.schema.dropTableIfExists("issues");
};
