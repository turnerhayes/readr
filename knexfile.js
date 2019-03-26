/* eslint-env node */

const path = require("path");

require("dotenv").config({
  path: path.join(__dirname, ".env"),
});

module.exports = {
  client: "pg",
  connection: process.env.DATA_DB_URL,
};
