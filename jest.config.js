/* eslint-env node */

"use strict";

require("dotenv").config();

module.exports = exports = {
  collectCoverageFrom: [
    "client/**/*.js",
    "!client/**/*.test.js",
    "!client/index.js",
    "!client/fonts/**",
  ],
  coverageThreshold: {
    global: {
      statements: 98,
      branches: 91,
      functions: 98,
      lines: 98,
    },
  },
  moduleDirectories: [
    "node_modules",
    "client",
  ],
  setupFiles: [
    "<rootDir>/config/testing/shim.js",
    "<rootDir>/config/testing/setup.js",
  ],
  setupFilesAfterEnv: [
    "<rootDir>/config/testing/test-bundler.js",
  ],
  testRegex: ".*\\.test\\.js$",
  resolver: "./config/testing/jest-resolver",
  testEnvironment: "jsdom",
  // For some reason, verbose often makes console.logs in tests not visible.
  // Disabling verbose fixes this, but is probably not the best thing for
  // tests in general
  verbose: process.env.NODE_ENV === "development",
};
