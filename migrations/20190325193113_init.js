/* eslint-env node */

/**
 * Runs the forward migration.
 *
 * @function
 *
 * @param {knex} knex the knex instance
 * @param {function} Promise the promise constructor
 */
exports.up = async function(knex, Promise) {
  await knex.schema.createTable("rents", (table) => {
    table.increments("id");
    table.integer("due_amount").unsigned().notNullable();
    table.date("due_date").notNullable();
    table.timestamps();
    table.timestamp("deleted_at");
  });

  await knex.schema.createTable("rent_payments", (table) => {
    table.increments("id");
    table.integer("rent_id").references("id").inTable("rents");
    table.integer("paid_amount").unsigned();
    table.timestamps();
    table.timestamp("deleted_at");
  });
};

exports.down = async function(knex, Promise) {
  await knex.schema.dropTableIfExists("rent_payments");

  await knex.schema.dropTableIfExists("rents");
};
