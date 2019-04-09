"use strict";

const createError = require("http-errors");
const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const { NOT_FOUND, INTERNAL_SERVER_ERROR } = require("http-status-codes");

const Config = require("./config");
const { startSchedule } = require("./mail/schedule-mail-check");

const app = express();

const { Logger } = require("./loggers");

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

startSchedule();

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(NOT_FOUND));
});

// error handler
// eslint-disable-next-line no-unused-vars
app.use(function(err, req, res, next) {
  const { status, headers } = err;
  delete err.status;
  delete err.headers;

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = Config.app.isDevelopment ? err : {};

  // render the error page
  res.status(status || INTERNAL_SERVER_ERROR);

  if (headers) {
    res.set(headers);
  }

  res.json({
    message: err.message,
    stack: Config.app.isDevelopment ?
      err.stack :
      null,
  });

  Logger.error({
    message: err.message,
    stack: err.stack,
  });
});

module.exports = app;
