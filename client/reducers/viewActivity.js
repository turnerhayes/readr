import { Map, List, is } from "immutable";

import { FETCH_NEW_ACTIVITY_COMPLETE } from "+app/actions";

export const viewActivityReducer = (state = Map(), action) => {
  switch (action.type) {
    case FETCH_NEW_ACTIVITY_COMPLETE: {
      const { newActivity } = action.payload;

      // If no new activity since the last activity check, make no changes
      if (is(newActivity, state)) {
        return state;
      }

      if (newActivity.get("issues", List()).isEmpty()) {
        state = state.delete("issues");
      } else {
        state = state.set("issues", newActivity.get("issues"));
      }

      if (newActivity.get("issueComments", Map()).isEmpty()) {
        state = state.delete("issueComments");
      } else {
        state = state.set("issueComments", newActivity.get("issueComments"));
      }

      return state;
    }

    default:
      return state;
  }
};
