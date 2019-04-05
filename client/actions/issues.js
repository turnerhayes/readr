import * as api from "+app/api";
import { Set } from "immutable";
import { fetchUsers } from "./users";

const ISSUE_USER_ID_PROPERTIES = [
  "createdBy",
  "updatedBy",
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
 * @param {object} [args]
 * @param {number[]} [args.ids] a list of issue ids to get
 *
 * @return {function} an action creator function
 */
export function fetchIssues({ ids } = {}) {
  return async (dispatch, getState) => {
    try {
      dispatch({
        type: FETCH_GET_ISSUES_START,
        payload: {
          ids,
        },
        api: {
          callName: "fetchIssues",
          status: "started",
        },
      });

      const issues = await api.getIssues({ ids });

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
        payload: {
          ids,
        },
        api: {
          callName: "fetchIssues",
          status: "complete",
        },
        error: ex,
      });

      throw ex;
    }
  };
}

export const FETCH_CREATE_ISSUE_START = "FETCH_CREATE_ISSUE_START";

export const FETCH_CREATE_ISSUE_FAIL = "FETCH_CREATE_ISSUE_FAIL";

export const FETCH_CREATE_ISSUE_COMPLETE = "FETCH_CREATE_ISSUE_COMPLETE";

/**
 * Action creator for creating an issue
 *
 * @param {object} issueData the issue to create
 *
 * @return {function} an action creator function
 */
export function createIssue(issueData) {
  return async (dispatch) => {
    try {
      dispatch({
        type: FETCH_CREATE_ISSUE_START,
        payload: issueData,
        api: {
          callName: "createIssue",
          status: "started",
        },
      });

      const issue = await api.createIssue(issueData);

      dispatch({
        type: FETCH_CREATE_ISSUE_COMPLETE,
        payload: {
          issue,
        },
        api: {
          callName: "createIssue",
          status: "complete",
        },
      });

      return issue;
    } catch (ex) {
      dispatch({
        type: FETCH_UPDATE_ISSUE_FAIL,
        payload: issueData,
        api: {
          callName: "createIssue",
          status: "complete",
        },
        error: ex,
      });

      throw ex;
    }
  };
}

export const FETCH_UPDATE_ISSUE_START = "FETCH_UPDATE_ISSUE_START";

export const FETCH_UPDATE_ISSUE_FAIL = "FETCH_UPDATTE_ISSUE_FAIL";

export const FETCH_UPDATE_ISSUE_COMPLETE = "FETCH_UPDATE_ISSUE_COMPLETE";

/**
 * Action creator for updating an issue
 *
 * @param {object} args
 * @param {number} args.issueID the ID of the issue to update
 * @param {object} args.updates a map of properties to update
 *
 * @return {function} an action creator function
 */
export function updateIssue({ issueID, updates }) {
  return async (dispatch) => {
    try {
      dispatch({
        type: FETCH_UPDATE_ISSUE_START,
        payload: {
          issueID,
          updates,
        },
        api: {
          callName: "updateIssue",
          status: "started",
        },
      });

      const issue = await api.updateIssue({
        issueID,
        updates,
      });

      dispatch({
        type: FETCH_UPDATE_ISSUE_COMPLETE,
        payload: {
          issue,
        },
        api: {
          callName: "updateIssue",
          status: "complete",
        },
      });
    } catch (ex) {
      dispatch({
        type: FETCH_UPDATE_ISSUE_FAIL,
        payload: {
          issueID,
          updates,
        },
        api: {
          callName: "updateIssue",
          status: "complete",
        },
        error: ex,
      });

      throw ex;
    }
  };
}

