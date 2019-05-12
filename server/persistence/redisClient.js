const Config = require("../config");
const { Logger } = require("../loggers");

if (!Config.redis.url) {
  module.exports = null;
  return;
}

const { promisify } = require("util");
const redis = require("redis");

const client = redis.createClient({
  url: Config.redis.url,
});

client.on("error", (err) => {
  Logger.error({
    message: err.message,
    stack: err.stack,
  });
});

module.exports = {
  get: promisify(client.get.bind(client)),
  set: promisify(client.set.bind(client)),
  del: promisify(client.del.bind(client)),
  client,
};
