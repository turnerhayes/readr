let connectionString = process.env.FIEF_SESSION_DB_URL;

if (!connectionString) {
  const dbConfig = require("./db");

  connectionString = dbConfig.connectionString;
}

const SessionConfig = {
  connectionString,
  tableName: "user_sessions",
  secret: process.env.FIEF_SESSION_SECRET,
  cookieName: process.env.FIEF_SESSION_COOKIE_NAME || "fief.session",
};

module.exports = SessionConfig;
