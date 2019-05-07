import { Map, List } from "immutable";

import { FETCH_NEW_ACTIVITY_COMPLETE } from "+app/actions";

export const viewActivityReducer = (state = Map(), action) => {
  switch (action.type) {
    case FETCH_NEW_ACTIVITY_COMPLETE: {
      const { newActivity } = action.payload;

      if (newActivity.get("issues", List()).isEmpty()) {
        state = state.delete("issues");
      } else {
        state = state.set("issues", newActivity.get("issues"));
      }

      if (newActivity.get("comments", Map()).isEmpty()) {
        state = state.delete("comments");
      } else {
        state = state.set("issueComments", newActivity.get("comments"));
      }

      return state;
    }

    default:
      return state;
  }
};
