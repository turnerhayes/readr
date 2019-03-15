module.exports = {
  "env": {
    "es6": true,
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "google",
  ],
  "parser": "babel-eslint",
  "globals": {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly",
  },
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true,
    },
    "ecmaVersion": 2018,
    "sourceType": "module",
  },
  "plugins": [
    "react",
  ],
  "settings": {
    "react": {
      "version": "detect",
    },
  },
  "rules": {
    "quotes": ["error", "double"],
    "require-jsdoc": ["warn"],
    "max-len": ["warn"],
    "object-curly-spacing": ["warn", "always"],
    "indent": [
      "error",
      2,
      {
        "CallExpression": {
          "arguments": 1,
        },
      },
    ],
  },
};
