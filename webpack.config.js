/* eslint-env node */

"use strict";

const path = require("path");
const webpack = require("webpack");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

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

      {
        test: /\.css$/,
        use: [
          environment === "development" ?
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
      NODE_ENV: environment,
    }),

    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
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
