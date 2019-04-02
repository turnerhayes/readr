import { Map, fromJS } from "immutable";

let items = Map();

let currentUserID;

const bodyContext = JSON.parse(
  document.body.dataset.context || "{}"
);

if (bodyContext.user) {
  const user = fromJS(bodyContext.user);

  items = items.set(
    user.get("id"),
    user
  );

  currentUserID = user.get("id");
}

const initialState = Map({
  items,
  current: currentUserID,
});

export const UsersReducer = (state = initialState, action) => {
  switch (action.type) {
    default: {
      return state;
    }
  }
};
