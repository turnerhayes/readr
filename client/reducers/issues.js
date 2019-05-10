import { Map } from "immutable";

import {
  ISSUES_CLEAR_SEARCH_RESULTS,
  fetchIssues,
  fetchIssue,
  createIssue,
  updateIssue,
  searchIssues,
  fetchIssueComments,
} from "+app/actions";

const initialState = Map({
  items: Map(),
});

const updateIssues = (state, issues) => {
  return state.updateIn(
    [
      "items",
    ],
    (issueItems) => (issueItems || Map()).mergeDeep(issues)
  );
};

export const IssuesReducer = (state = initialState, action) => {
  switch (action.type) {
    case fetchIssues.actionTypes.complete: {
      return updateIssues(state, action.payload.issues);
    }

    case fetchIssue.actionTypes.complete:
    case createIssue.actionTypes.complete:
    case updateIssue.actionTypes.complete: {
      return state.mergeDeepIn(
        [
          "items",
          action.payload.issue.get("id"),
        ],
        action.payload.issue
      );
    }

    case searchIssues.actionTypes.complete: {
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

    case ISSUES_CLEAR_SEARCH_RESULTS: {
      return state.delete("searchResults");
    }

    case fetchIssueComments.actionTypes.complete: {
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
