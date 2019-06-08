
exports.up = function(knex, Promise) {
  return knex.schema.createTable("works", (table) => {
    table.increments("id").notNullable();
    table.string("title").notNullable();
    table.string("author").notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("works");
};
