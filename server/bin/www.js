#!/usr/bin/env node

"use strict";

const path = require("path");

const PROJECT_ROOT = path.resolve(__dirname, "..", "..");

require("dotenv").config({
  path: path.join(PROJECT_ROOT, ".env"),
});

const fs = require("fs");

const http = require("http");
const spdy = require("spdy");

const Config = require("../config");
const app = require("../app");

app.set("port", Config.app.address.port);

/*
 * Create HTTP server.
 */

let key;
let cert;

try {
  key = fs.readFileSync(
    Config.app.address.ssl.keyPath,
    "utf8"
  );

  cert = fs.readFileSync(
    Config.app.address.ssl.certPath,
    "utf8"
  );
} catch (ex) {
  if (ex.code !== "ENOENT") {
    throw ex;
  }
}

let server;

if (key && cert) {
  const options = {
    key,
    cert,
  };

  server = spdy.createServer(options, app);
} else {
  server = http.createServer(app);
}


/**
 * Event listener for HTTP server "error" event.
 *
 * @param {Error} error the error
 */
function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = "Port " + Config.app.address.port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      // eslint-disable-next-line no-console
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      // eslint-disable-next-line no-console
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  const addr = server.address();
  const bind = typeof addr === "string" ?
    "pipe " + addr :
    "port " + addr.port;
  // eslint-disable-next-line no-console
  console.log("Listening on " + bind);
}

/*
 * Listen on provided port, on all network interfaces.
 */

server.listen(Config.app.address.port);
server.on("error", onError);
server.on("listening", onListening);
