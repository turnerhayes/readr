const {
  UNAUTHORIZED,
} = require("http-status-codes");

const Config = require("../config");

const ensureLoggedIn = (req, res, next) => {
  if (!req.user) {
    const err = new Error("Must be logged in");
    err.status = UNAUTHORIZED;
    err.headers = {
      "WWW-Authenticate": `Bearer, realm="${Config.app.address.origin}"`,
    };

    return next(err);
  }

  next();
};

module.exports = {
  ensureLoggedIn,
};

