const defaultFs = require("fs");
const path = require("path");

module.exports = {
  async getIndexString({
    fs = defaultFs,
    outputPath,
  }) {
    return new Promise(
      (resolve, reject) => fs.readFile(
        path.resolve(outputPath, "index.mustache"),
        "utf8",
        (err, content) => {
          if (err) {
            return reject(err);
          }

          return resolve(content);
        }
      )
    );
  },
};
