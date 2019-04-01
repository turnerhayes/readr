"use strict";

const session = require("express-session");
const PGSession = require("connect-pg-simple")(session);
const { Pool } = require("pg");

const Config = require("./config");

const pgPool = new Pool({
  connectionString: Config.session.connectionString,
});

const THIRTY_DAYS_IN_MILLISECONDS = 30 * 24 * 60 * 60 * 1000;

exports = module.exports = session({
  store: new PGSession({
    pool: pgPool,
    tableName: Config.session.tableName,
  }),
  secret: Config.session.secret,
  name: Config.session.cookieName,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: THIRTY_DAYS_IN_MILLISECONDS,
    secure: false,
  },
});
