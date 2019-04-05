import { Set } from "immutable";

export const getUsers = (state, { ids }) => {
  ids = Set(ids);
  return state.users.get("items").filter(
    (user) => ids.has(user.get("id"))
  );
};
