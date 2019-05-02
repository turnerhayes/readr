const winston = require("winston");

const Logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      format: winston.format.json(),
    }),
  ],
});

module.exports = {
  Logger,
};

