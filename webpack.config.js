/* eslint-env node */

"use strict";

const path = require("path");
const webpack = require("webpack");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

require("dotenv").config();

const Config = require("./server/config");

let webpackConfig = {
  entry: [
    "babel-polyfill",
    "./client/index.js",
  ],
  output: require("./config/webpack/output"),
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },

      {
        test: /\.css$/,
        use: [
          Config.app.isDevelopment ?
            "style-loader" :
            {
              loader: MiniCssExtractPlugin.loader,
            },
          "css-loader",
        ],
      },

      {
        test: /\.(eot|svg|otf|ttf|woff|woff2)$/,
        use: "file-loader",
      },

      {
        test: /\.(jpg|png|gif)$/,
        use: [
          "file-loader",
          {
            loader: "image-webpack-loader",
            options: {
              mozJpeg: {
                progressive: true,
              },
              optipng: {
                optimizationLevel: 7,
              },
              gifsicle: {
                interlaced: false,
              },
              pngquant: {
                quality: "65-90",
                speed: 4,
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: path.join("server", "index.mustache.lodash-template.html"),
      filename: "index.mustache",
    }),

    new webpack.EnvironmentPlugin({
      NODE_ENV: Config.app.environment,
      ...Object.keys(Config.auth.providers).reduce(
        (enabled, provider) => {
          if (Config.auth.providers[provider].isEnabled) {
            enabled[`ENABLED_AUTH_PROVIDER_${provider.toUpperCase()}`] = true;
          }

          return enabled;
        },
        {}
      ),
    }),

    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),
  ],
  resolve: {
    alias: require("./config/webpack/aliases"),
  },
  mode: Config.app.environment,
  devtool: "inline-source-map",
};

try {
  const additionalConfig = require(
    `./webpack.${Config.app.environment}.config`
  );
  const merge = require("webpack-merge");

  webpackConfig = merge.smartStrategy({
    entry: "prepend",
  })(webpackConfig, additionalConfig);
} catch (ex) {
  if (
    !(ex instanceof Error && ex.code === "MODULE_NOT_FOUND")
  ) {
    throw ex;
  }
}

module.exports = webpackConfig;
