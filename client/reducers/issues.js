import { Map } from "immutable";

import {
  FETCH_GET_ISSUES_COMPLETE,
  FETCH_UPDATE_ISSUE_COMPLETE,
} from "+app/actions";

const initialState = Map({
  items: Map(),
  isFetched: false,
});

export const IssuesReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_GET_ISSUES_COMPLETE: {
      return state.mergeIn(
        [
          "items",
        ],
        action.payload.issues
      ).set("isFetched", true);
    }

    case FETCH_UPDATE_ISSUE_COMPLETE: {
      return state.setIn(
        [
          "items",
          action.payload.issue.get("id"),
        ],
        action.payload.issue
      );
    }

    default: {
      return state;
    }
  }
};
