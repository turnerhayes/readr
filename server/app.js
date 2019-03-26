"use strict";

const createError = require("http-errors");
const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const { NOT_FOUND, INTERNAL_SERVER_ERROR } = require("http-status-codes");

const manifestRouter = require("./routes/manifest");

const app = express();

const IS_DEVELOPMENT = process.env.NODE_ENV === "development";

app.locals.IS_DEVELOPMENT = IS_DEVELOPMENT;

app.use(logger("dev"));
app.use(cookieParser());
app.use(manifestRouter);

app.use("/api", require("./routes/api"));

if (IS_DEVELOPMENT) {
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
  res.locals.error = IS_DEVELOPMENT ? err : {};

  // render the error page
  res.status(err.status || INTERNAL_SERVER_ERROR);
  res.json({
    message: err.message,
    stack: IS_DEVELOPMENT ?
      err.stack :
      null,
  });

  if (IS_DEVELOPMENT) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
});

module.exports = app;
