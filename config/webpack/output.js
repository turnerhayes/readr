/* eslint-env node */

const path = require("path");
const Config = require("../../server/config");

module.exports = {
  filename: "main.js",
  publicPath: "/",
  path: path.resolve(Config.paths.projectRoot, "dist"),
};
