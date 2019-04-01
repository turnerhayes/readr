exports.up = async function(knex, Promise) {
  await knex.schema.createTable("users", (table) => {
    table.increments("id");
    table.string("username").notNullable();
    table.string("email").notNullable();
    table.string("provider").notNullable();
    table.string("provider_id").notNullable();
    table.string("first_name");
    table.string("last_name");
    table.string("middle_name");
    table.string("display_name");
    table.timestamps(false, true);
    table.timestamp("deleted_at");
  });

  return knex.schema.createTable("user_permissions", (table) => {
    table.integer("user_id")
      .notNullable()
      .references("id")
      .inTable("users");
    table.boolean("is_admin");
    table.timestamps(false, true);
    table.timestamp("deleted_at");
  });
};

exports.down = async function(knex, Promise) {
  await knex.schema.dropTableIfExists("user_permissions");

  await knex.schema.dropTableIfExists("users");
};
