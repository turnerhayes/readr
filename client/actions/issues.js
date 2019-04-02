import * as api from "+app/api";
import { Set } from "immutable";
import { fetchUsers } from "./users";

const ISSUE_USER_ID_PROPERTIES = [
  "createdByUserID",
  "updatedByUserID",
];

const getUserIDsFromIssues = (issues) => {
  return Set().withMutations(
    (idSet) => {
      issues.forEach(
        (issue) => {
          ISSUE_USER_ID_PROPERTIES.forEach(
            (prop) => {
              if (issue.get(prop) !== null) {
                idSet.add(issue.get(prop));
              }
            }
          );
        }
      );
    }
  );
};

export const FETCH_GET_ISSUES_START = "FETCH_GET_ISSUES_START";

export const FETCH_GET_ISSUES_FAIL = "FETCH_GET_ISSUES_FAIL";

export const FETCH_GET_ISSUES_COMPLETE = "FETCH_GET_ISSUES_COMPLETE";

/**
 * Action creator for fetching issues
 *
 * @return {function} an action creator function
 */
export function fetchIssues() {
  return async (dispatch, getState) => {
    try {
      dispatch({
        type: FETCH_GET_ISSUES_START,
        payload: {},
        api: {
          callName: "fetchIssues",
          status: "started",
        },
      });

      const issues = await api.getIssues();

      const issueUserIDs = getUserIDsFromIssues(issues);

      const missingUserIDs = issueUserIDs.subtract(
        getState().users.get("items").keySeq()
      );

      if (!missingUserIDs.isEmpty()) {
        dispatch(
          fetchUsers({
            ids: missingUserIDs.toArray(),
          })
        );
      }

      dispatch({
        type: FETCH_GET_ISSUES_COMPLETE,
        payload: {
          issues,
        },
        api: {
          callName: "fetchIssues",
          status: "complete",
        },
      });
    } catch (ex) {
      dispatch({
        type: FETCH_GET_ISSUES_FAIL,
        api: {
          callName: "fetchIssues",
          status: "complete",
        },
        error: ex,
      });
    }
  };
}
