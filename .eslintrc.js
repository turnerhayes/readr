module.exports = {
  "env": {
    "es6": true,
  },
  "extends": [
    "eslint:recommended",
    "google",
  ],
  "parser": "babel-eslint",
  "globals": {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly",
  },
  "parserOptions": {
    "ecmaVersion": 2018,
    "sourceType": "module",
  },
  "plugins": [
    "babel",
  ],
  "rules": {
    "quotes": ["error", "double"],
    "require-jsdoc": ["warn"],
    "max-len": ["warn"],
    "object-curly-spacing": ["warn", "always"],
    "no-invalid-this": ["off"],
    "babel/no-invalid-this": ["error"],
    "indent": [
      "error",
      2,
      {
        "CallExpression": {
          "arguments": 1,
        },
        "SwitchCase": 1
      },
    ],
    "new-cap": [
      "warn",
      {
        "capIsNewExceptions": [
          "Map",
          "OrderedMap",
          "Set",
        ],
      },
    ],
  },
  "overrides": [
    {
      "files": [
        "**/*.test.js",
      ],
      "env": {
        "jest": true,
      },
    },
  ]
};
