const path = require("path");

const projectRoot = path.resolve(__dirname, "..", "..");

const PathConfig = {
  projectRoot,
  client: path.join(projectRoot, "client"),
};

module.exports = PathConfig;
