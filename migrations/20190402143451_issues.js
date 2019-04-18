exports.up = async function(knex, Promise) {
  await knex.schema.createTable("issues", (table) => {
    table.increments("id");
    table.string("description").notNullable();
    table.text("body");
    table.text("body_format").default("markdown");
    table.string("created_by_text");
    table.integer("created_by")
      .references("id")
      .inTable("users");
    table.string("updated_by_text");
    table.integer("updated_by")
      .references("id")
      .inTable("users");
    table.string("status").notNullable();
    table.string("origin_message_id").unique();
    table.timestamps(false, true);
    table.timestamp("deleted_at");
  });
};

exports.down = async function(knex, Promise) {
  await knex.schema.dropTableIfExists("issues");
};
