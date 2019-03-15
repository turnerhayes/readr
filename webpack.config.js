/* eslint-env node */

"use strict";

const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");

const environment = process.env.NODE_ENV || "development";

let config = {
  entry: [
    "./client/index.js",
  ],
  output: {
    filename: "main.js",
    publicPath: "/",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
    ],
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: path.join("server", "index.mustache.lodash"),
      filename: "index.mustache",
    }),
  ],
  resolve: {
    alias: require("./config/webpack/aliases"),
  },
  mode: environment,
  devtool: "inline-source-map",
};

try {
  const additionalConfig = require(`./webpack.${environment}.config`);
  const merge = require("webpack-merge");

  config = merge.smartStrategy({
    entry: "prepend",
  })(config, additionalConfig);
} catch (ex) {
  if (
    !(ex instanceof Error && ex.code === "MODULE_NOT_FOUND")
  ) {
    throw ex;
  }
}

module.exports = config;
