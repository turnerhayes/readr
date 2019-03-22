module.exports = {
  "extends": [
    "plugin:react/recommended",
    "../.eslintrc.js",
  ],
  "env": {
    "browser": true,
  },
  "parserOptions": {
    "jsx": true,
  },
  "plugins": [
    "react",
    "react-hooks",
  ],
  "settings": {
    "react": {
      "version": "detect",
    },
  },
  "rules": {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
  },
};
