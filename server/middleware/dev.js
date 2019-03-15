"use strict";

const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const {
  ready,
} = require("webpack-dev-middleware/lib/util");
const webpackHotMiddleware = require("webpack-hot-middleware");
const Mustache = require("mustache");

const { getIndexString } = require("./common");
const webpackConfig = require("../../webpack.config");

let indexString;

module.exports = function addDevMiddlewares(app) {
  const compiler = webpack(webpackConfig);

  const middleware = webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath,
    silent: true,
    stats: "errors-only",
    // Don't serve index route--we do that in the catch-all handler below
    index: false,
  });

  /**
   * Handles requests.
   *
   * @param {Request} req the request
   * @param {Response} res the response object
   * @param {function} next callback to pass control to next handler
   */
  function handleRequest(req, res, next) {
    // Make sure the bundle is built before attempting to render the index file
    ready(
      middleware.context,
      async () => {
        try {
          if (!indexString) {
            indexString = await getIndexString({
              fs: middleware.fileSystem,
              outputPath: compiler.outputPath,
            });
          }

          const index = Mustache.render(
            indexString,
            {
              context: JSON.stringify({
                user: req.user,
              }),
            },
          );

          res.send(index);
        } catch (ex) {
          next(ex);
        }
      },
      req
    );
  }


  app.use(middleware);
  app.use(webpackHotMiddleware(compiler, {
    overlay: true,
  }));

  app.get("*", handleRequest);
};
