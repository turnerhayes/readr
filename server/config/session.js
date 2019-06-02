let connectionString = process.env.READR_SESSION_DB_URL;

if (!connectionString) {
  const dbConfig = require("./db");

  connectionString = dbConfig.connectionString;
}

const SessionConfig = {
  connectionString,
  tableName: "user_sessions",
  secret: process.env.READR_SESSION_SECRET,
  cookieName: process.env.READR_SESSION_COOKIE_NAME || "readr.session",
};

module.exports = SessionConfig;
