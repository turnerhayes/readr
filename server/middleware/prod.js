const express = require("express");
const compression = require("compression");
const Mustache = require("mustache");

const { getIndexString } = require("./common");
const { path, publicPath } = require("../../config/webpack/output");

let indexString;

module.exports = function addProdMiddleware(app) {
  app.use(compression());
  app.use(publicPath, express.static(path));

  app.use(
    "*",
    async (req, res, next) => {
      try {
        if (!indexString) {
          indexString = await getIndexString({
            path,
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
