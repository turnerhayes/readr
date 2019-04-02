const assert = require("assert");

const { getDataConnection } = require("../connections");

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

  const connection = await getDataConnection();

  let query = connection.select()
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

  return results[0];
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

  return results[0];
};

module.exports = {
  findUser,
  addUser,
};

