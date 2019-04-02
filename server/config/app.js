const path = require("path");
const pathsConfig = require("./paths");

const DEFAULT_PORT = 7000;

let {
  NODE_ENV: environment = "development",
  FIEF_HOST: host = "localhost",
  FIEF_PORT: port = DEFAULT_PORT,
  FIEF_EXTERNAL_PORT: externalPort = port,
  FIEF_APP_SSL_KEY: sslKeyPath,
  FIEF_APP_SSL_CERT: sslCertPath,
  FIEF_APP_IS_SECURE: isSecure,
} = process.env;

const HTTP_DEFAULT_PORT = 80;
const HTTPS_DEFAULT_PORT = 443;

if (sslKeyPath) {
  sslKeyPath = path.resolve(pathsConfig.projectRoot, sslKeyPath);
}

if (sslCertPath) {
  sslCertPath = path.resolve(pathsConfig.projectRoot, sslCertPath);
}

isSecure = isSecure || Boolean(
  sslKeyPath &&
  sslCertPath
);

let origin = "http" + (isSecure ? "s" : "") + "://" +
    host;

if (
  !(externalPort === HTTP_DEFAULT_PORT && !isSecure) &&
  !(externalPort === HTTPS_DEFAULT_PORT && isSecure)
) {
  origin += ":" + externalPort;
}

const AppConfig = {
  environment,
  isDevelopment: environment === "development",
  address: {
    host,
    port,
    externalPort,
    origin,
    isSecure: isSecure || Boolean(
      sslKeyPath &&
      sslCertPath
    ),
    ssl: {
      keyPath: sslKeyPath,
      certPath: sslCertPath,
    },
  },
};

module.exports = AppConfig;
