import { Map } from "immutable";

export const APIReducer = (state = Map(), action) => {
  if (action.meta && "api" in action.meta) {
    if (action.meta.api.status === "complete") {
      return state.deleteIn(
        [
          "calls",
          action.meta.api.callName,
        ]
      );
    } else {
      return state.setIn(
        [
          "calls",
          action.meta.api.callName,
        ],
        true
      );
    }
  }

  return state;
};
