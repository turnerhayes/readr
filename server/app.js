"use strict";

const createError = require("http-errors");
const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const { NOT_FOUND, INTERNAL_SERVER_ERROR } = require("http-status-codes");

const Config = require("./config");

const app = express();

app.use(require("./session"));

app.locals.IS_DEVELOPMENT = Config.app.isDevelopment;

app.use(logger("dev"));
app.use(cookieParser());

require("./middleware/passport")(app);

app.use(require("./routes"));

if (Config.app.isDevelopment) {
  require("./middleware/dev")(app);
} else {
  require("./middleware/prod")(app);
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(NOT_FOUND));
});

// error handler
// eslint-disable-next-line no-unused-vars
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = Config.app.isDevelopment ? err : {};

  // render the error page
  res.status(err.status || INTERNAL_SERVER_ERROR);
  res.json({
    message: err.message,
    stack: Config.app.isDevelopment ?
      err.stack :
      null,
  });

  if (Config.app.isDevelopment) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
});

module.exports = app;
