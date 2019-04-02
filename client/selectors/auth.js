import { createSelector } from "reselect";

export const currentUser = (state) => {
  const currentUserID = state.users
    .get("current");

  if (currentUserID === undefined) {
    return null;
  }

  return state.users.getIn(
    [
      "items",
      currentUserID,
    ],
    null
  );
};

export const isLoggedIn = createSelector(
  [
    currentUser,
  ],
  (currentUser) => currentUser !== null
);
