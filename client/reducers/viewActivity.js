import { Map, Set, List, is } from "immutable";

import {
  getNewActivity,
  markIssueSeen,
} from "+app/actions";

export const viewActivityReducer = (state = Map(), action) => {
  switch (action.type) {
    case getNewActivity.actionTypes.complete: {
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

    case markIssueSeen.actionTypes.complete: {
      const { markedItems } = action.payload;

      const markedIssueIDs = markedItems.get("issues", List());
      const markedComments = markedItems.get("issueComments", Map());

      if (!markedIssueIDs.isEmpty()) {
        state = state.update(
          "issues",
          (issueIDs) => Set(issueIDs).subtract(markedIssueIDs).toList()
        );
      }

      if (!markedComments.isEmpty()) {
        state = state.update(
          (comments) => (comments || Map()).map(
            (commentIDs, issueID) => {
              if (markedComments.has(issueID)) {
                return Set(commentIDs).subtract(
                  markedComments.get(issueID)
                ).toList();
              } else {
                return commentIDs;
              }
            }
          )
        );
      }

      return state;
    }

    default:
      return state;
  }
};
