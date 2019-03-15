const express = require("express");
const compression = require("compression");
const Mustache = require("mustache");

const { getIndexString } = require("./common");
const webpackConfig = require("../../webpack.config");

let indexString;

module.exports = function addProdMiddleware(app) {
  const outputPath = webpackConfig.output.path;
  const publicPath = webpackConfig.output.publicPath;

  app.use(compression());
  app.use(publicPath, express.static(outputPath));

  app.use(
    "*",
    async (req, res, next) => {
      try {
        if (!indexString) {
          indexString = await getIndexString({
            outputPath,
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
    }
  );
};
