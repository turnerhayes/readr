const AuthConfig = {
  providers: {},
};

const AUTH_KEY_REGEX = /^FIEF_AUTH_CREDENTIALS_([A-Z]+)_([A-Z_]+)$/;

const ALL_POSSIBLE_PROVIDERS = [
  "facebook",
  "google",
  "twitter",
];

/**
 * Converts a string to a camelCase identifier, with a few
 * exceptions (e.g. "ID" stays capitalized)
 *
 * @param {string} str the string to convert
 *
 * @return {string} the converted string
 */
const toCamelCase = (str) => {
  const parts = str.split("_");

  for (let i = 0; i < parts.length; i++) {
    let part = parts[i];

    if (part === "ID") {
      // leave "ID" capitalized
      continue;
    }

    part = part.toLowerCase();

    if (i > 0) {
      part = part[0].toUpperCase() + part.slice(1);
    }

    parts[i] = part;
  }

  return parts.join("");
};

for (const envKey of Object.keys(process.env)) {
  const matches = AUTH_KEY_REGEX.exec(envKey);

  if (matches) {
    let [, provider, authProp] = matches;

    provider = provider.toLowerCase();

    if (!ALL_POSSIBLE_PROVIDERS.includes(provider)) {
      throw new Error(`Unknown OAuth provider: ${provider}`);
    }

    if (!(provider in AuthConfig.providers)) {
      AuthConfig.providers[provider] = {
        credentials: {},
        callbackURL: `/auth/${provider}/callback`,
      };
    }

    AuthConfig.providers[provider].credentials[
      toCamelCase(authProp)
    ] = process.env[envKey];
  }
}

for (const provider of ALL_POSSIBLE_PROVIDERS) {
  const enabled = provider in AuthConfig.providers;

  if (!enabled) {
    AuthConfig.providers[provider] = {};
  }

  Object.defineProperty(
    AuthConfig.providers[provider],
    "isEnabled",
    {
      enumerable: true,
      value: enabled,
    }
  );
}

if (AuthConfig.providers.facebook.isEnabled) {
  AuthConfig.providers.facebook.scope = [
    "public_profile",
    "email",
    "user_friends",
  ];
}

if (AuthConfig.providers.google.isEnabled) {
  AuthConfig.providers.google.scope = [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
  ];
}

module.exports = AuthConfig;
