/* eslint-env node */

"use strict";

const webpack = require("webpack");

module.exports = {
  entry: [
    "eventsource-polyfill", // Necessary for hot reloading with IE
    "webpack-hot-middleware/client?reload=true",
  ],
  plugins: [
    // Tell webpack we want hot reloading
    new webpack.HotModuleReplacementPlugin(),
  ],
  devtool: "inline-source-map",
};
