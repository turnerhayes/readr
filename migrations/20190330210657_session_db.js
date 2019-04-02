const Config = require("../server/config");

exports.up = function(knex, Promise) {
  return knex.schema.createTable(Config.session.tableName, (table) => {
    table.string("sid").primary().notNullable();
    table.json("sess").notNullable();
    table.timestamp("expire", false, 6);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists(Config.session.tableName);
};
