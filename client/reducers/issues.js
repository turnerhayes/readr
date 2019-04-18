import { Map } from "immutable";

import {
  FETCH_GET_ISSUES_COMPLETE,
  FETCH_UPDATE_ISSUE_COMPLETE,
  FETCH_CREATE_ISSUE_COMPLETE,
  FETCH_GET_ISSUE_COMMENTS_COMPLETE,
  FETCH_GET_ISSUE_COMPLETE,
  FETCH_SEARCH_ISSUES_COMPLETE,
} from "+app/actions";

const initialState = Map({
  items: Map(),
  isFetched: false,
});

const updateIssues = (state, issues) => {
  return state.updateIn(
    [
      "items",
    ],
    (issueItems) => (issueItems || Map()).merge(issues)
  );
};

export const IssuesReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_GET_ISSUES_COMPLETE: {
      return updateIssues(state, action.payload.issues)
        .set("isFetched", true);
    }

    case FETCH_GET_ISSUE_COMPLETE:
    case FETCH_CREATE_ISSUE_COMPLETE:
    case FETCH_UPDATE_ISSUE_COMPLETE: {
      return state.setIn(
        [
          "items",
          action.payload.issue.get("id"),
        ],
        action.payload.issue
      );
    }

    case FETCH_SEARCH_ISSUES_COMPLETE: {
      return updateIssues(state, action.payload.results)
        .setIn(
          [
            "searchResults",
          ],
          action.payload.results.map(
            (result) => result.get("id")
          )
        );
    }

    case FETCH_GET_ISSUE_COMMENTS_COMPLETE: {
      const { issueComments, issueID } = action.payload;

      return state.setIn(
        [
          "items",
          issueID,
          "comments",
        ],
        issueComments
      );
    }

    default: {
      return state;
    }
  }
};
