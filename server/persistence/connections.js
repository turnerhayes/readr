const debug = require("debug")("readr:server:db");
const knex = require("knex");
const pg = require("pg");

const Config = require("../config");

const dataConnection = knex({
  client: "pg",
  connection: Config.db.connectionString,
  debug: debug.enabled,
  asyncStackTraces: debug.enabled,
});

/**
 * Overrides default type parsing for PostgreSQL with custom parsing.
 *
 * @param {knex} connection the connection for which to override
 * the parsing
 *
 * @return {Promise<knex>} a promise that resolves when the types
 * have been overriden, with the passed connection object as its value
 */
const overridePGTypeParsing = async (connection) => {
  const [{ oid, arrayid }] = await connection.select({
    "oid": "oid",
    "arrayid": "typarray",
  })
    .from("pg_type")
    .where("typname", "date");

  const parser = (val) => val;

  pg.types.setTypeParser(
    oid,
    // override parsing date column to Date()
    parser
  );

  pg.types.setTypeParser(
    arrayid,
    (valString) => pg.types.arrayParser.create(
      valString,
      parser
    ).parse()
  );

  return connection;
};

const dataConnectionPromise = overridePGTypeParsing(dataConnection);

module.exports = {
  getDataConnection() {
    return dataConnectionPromise;
  },
};
