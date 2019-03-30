import { Map } from "immutable";

export const APIReducer = (state = Map(), action) => {
  if ("api" in action) {
    if (action.api.status === "complete") {
      return state.deleteIn(
        [
          "calls",
          action.api.callName,
        ]
      );
    } else {
      return state.setIn(
        [
          "calls",
          action.api.callName,
        ],
        true
      );
    }
  }

  return state;
};
