const winston = require("winston");

const Logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      format: winston.format.cli(),
    }),
  ],
});

module.exports = {
  Logger,
};

