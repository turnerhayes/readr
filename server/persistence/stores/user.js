const assert = require("assert");

const { getDataConnection } = require("../connections");

const transformResultToUser = (result) => {
  const name = {};

  if (result.first_name) {
    name.first = result.first_name;
  }
  delete result.first_name;

  if (result.middle_name) {
    name.middle = result.middle_name;
  }
  delete result.middle_name;

  if (result.last_name) {
    name.last = result.last_name;
  }
  delete result.last_name;

  if (result.display_name) {
    name.display = result.display_name;
  }
  delete result.display_name;

  if (!name.display) {
    name.display = [name.first, name.last]
      .filter((n) => n)
      .join(" ");
  }

  result.name = name;

  return result;
};

const findUser = async ({
  id,
  provider,
  providerID,
}) => {
  if (providerID !== undefined) {
    assert(
      provider,
      "findUser() requires a `provider` parameter if passed a `providerID`"
    );
  }

  if (provider) {
    assert(
      providerID,
      "findUser() requires a `providerID` parameter if passed a `provider`"
    );
  }

  const connection = await getDataConnection();

  let query = connection.select(
    "id",
    "username",
    "first_name",
    "middle_name",
    "last_name",
    "display_name",
  )
    .from("users")
    .whereNull("deleted_at");

  if (id !== undefined) {
    query = query.where({ id });
  } else if (providerID !== undefined) {
    query = query.where({
      provider,
      provider_id: providerID,
    });
  }

  const results = await query;

  if (results.length === 0) {
    return null;
  }

  return transformResultToUser(results[0]);
};

const addUser = async ({
  username,
  email,
  provider,
  // eslint-disable-next-line camelcase
  providerID: provider_id,
  name: {
    /* eslint-disable camelcase */
    first: first_name,
    middle: middle_name,
    last: last_name,
    display: display_name,
    /* eslint-enable camelcase */
  },
}) => {
  const connection = await getDataConnection();

  const results = await connection.insert({
    username,
    email,
    provider,
    provider_id,
    first_name,
    middle_name,
    last_name,
    display_name,
  }).into(
    "users"
  ).returning("*");

  return transformResultToUser(results[0]);
};

const getUsers = async ({
  ids,
}) => {
  const connection = await getDataConnection();

  let query = connection.select(
    "id",
    "username",
    "first_name",
    "middle_name",
    "last_name",
    "display_name",
  ).from(
    "users"
  ).whereNull("deleted_at");

  if (ids && ids.length > 0) {
    if (ids.length === 1) {
      query = query.where({
        id: ids[0],
      });
    } else {
      query = query.whereIn(
        "id",
        ids
      );
    }
  }

  const users = await query;

  return users.map(transformResultToUser);
};

module.exports = {
  findUser,
  addUser,
  getUsers,
};

