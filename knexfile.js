/* eslint-env node */

const path = require("path");

require("dotenv").config({
  path: path.join(__dirname, ".env"),
});

const Config = require("./server/config");

const dbURL = Config.db.connectionString;

if (!dbURL) {
  // eslint-disable-next-line no-console
  console.error(
    // eslint-disable-next-line max-len
    "No database URL set; cannot run migration. Set the DATA_DB_URL environment variable and try again"
  );
}

module.exports = {
  client: "pg",
  connection: dbURL,
};
