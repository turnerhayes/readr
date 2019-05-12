"use strict";

const passport = require("passport");
const debug = require("debug")("fief:server:middleware:passport");
const {
  findUser,
  addUser,
} = require("../persistence/stores/user");
const redisClient = require("../persistence/redisClient");
const Config = require("../config");

passport.serializeUser(async (user, done) => {
  if (redisClient !== null) {
    await redisClient.set(`user:${user.id}`, JSON.stringify(user));
  }
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    let user;

    if (redisClient !== null) {
      const userString = await redisClient.get(`user:${id}`);

      if (userString) {
        user = JSON.parse(userString);
      }
    }

    if (!user) {
      user = await findUser({ id });
    }

    done(null, user);
  } catch (ex) {
    done(ex);
  }
});

/**
 * Gets a canonicalized user info object from an OAuth 2.0 profile
 *
 * @param {object} profile the OAuth profile object
 *
 * @return {object}
 */
function getUserInfoFromOAuth20Profile(profile) {
  const email = profile.emails &&
    profile.emails.length &&
    profile.emails[0].value;

  return {
    id: profile.id,
    username: profile.username || email || profile.id,
    email,
    displayName: profile.displayName,
    name: {
      givenName: profile.name && profile.name.givenName,
      familyName: profile.name && profile.name.familyName,
      middleName: profile.name && profile.name.middleName,
    },
  };
}

/**
 * Gets the user object corresponding to the `profile`, or
 * creates such a user if one does not exist
 *
 * @param {object} args
 *
 * @return {Promise<object>}
 */
async function getOrCreateUser({ req, provider, profile }) {
  let user = await findUser({
    provider,
    providerID: profile.id,
  });

  if (!user) {
    user = await addUser({
      username: profile.username,
      email: profile.email,
      provider,
      providerID: profile.id,
      name: {
        first: profile.name.givenName,
        middle: profile.name.middleName,
        last: profile.name.familyName,
        display: profile.displayName,
      },
    });
  }

  return user;
}

if (Config.auth.providers.facebook.isEnabled) {
  const FacebookStrategy = require("passport-facebook-rwky");

  passport.use(new FacebookStrategy(
    {
      clientID: Config.auth.providers.facebook.credentials.appID,
      clientSecret: Config.auth.providers.facebook.credentials.appSecret,
      callbackURL: Config.app.address.origin +
        Config.auth.providers.facebook.callbackURL,
      passReqToCallback: true,
      profileFields: ["id", "email", "name", "displayName"],
      enableProof: true,
    },
    (req, accessToken, refreshToken, profile, done) => {
      getOrCreateUser({
        req,
        provider: "facebook",
        profile: getUserInfoFromOAuth20Profile(profile),
      }).then(
        (user) => done(null, user)
      ).catch(done);
    }
  ));
}

if (Config.auth.providers.google.isEnabled) {
  const GoogleOAuthStrategy = require("passport-google-oauth20");

  passport.use(new GoogleOAuthStrategy(
    {
      clientID: Config.auth.providers.google.credentials.clientID,
      clientSecret: Config.auth.providers.google.credentials.clientSecret,
      callbackURL: Config.app.address.origin +
        Config.auth.providers.google.callbackURL,
      passReqToCallback: true,
    },
    (req, accessToken, refreshToken, profile, done) => {
      getOrCreateUser({
        req,
        provider: "google",
        profile: getUserInfoFromOAuth20Profile(profile),
      }).then(
        (user) => done(null, user)
      ).catch(done);
    }
  ));
}

if (Config.auth.providers.twitter.isEnabled) {
  const TwitterStrategy = require("passport-twitter");

  passport.use(new TwitterStrategy(
    {
      consumerKey: Config.auth.providers.twitter.consumerKey,
      consumerSecret: Config.auth.providers.twitter.consumerSecret,
      callbackURL: Config.app.address.origin +
        Config.auth.providers.twitter.callbackURL,
      passReqToCallback: true,
    },
    (req, token, tokenSecret, profile, done) => {
      getOrCreateUser({
        req,
        provider: "twitter",
        profile: getUserInfoFromOAuth20Profile(profile),
      }).then(
        (user) => done(null, user)
      ).catch(done);
    }
  ));
}

module.exports = exports = function addPassportMiddleware(app) {
  debug("Adding Passport.js middleware");
  app.use(passport.initialize());
  app.use(passport.session());
};
