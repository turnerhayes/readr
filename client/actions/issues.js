import * as api from "+app/api";
import { Set, List } from "immutable";
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

          if (issue.get("comments", List()).size > 0) {
            idSet.concat(getUserIDsFromIssues(issue.get("comments")));
          }
        }
      );
    }
  );
};

const getMissingUserIDs = async ({
  items,
  getState,
  dispatch,
}) => {
  const referencedUserIDs = getUserIDsFromIssues(items);

  const missingUserIDs = referencedUserIDs.subtract(
    getState().users.get("items").keySeq()
  );

  if (!missingUserIDs.isEmpty()) {
    await dispatch(
      fetchUsers({
        ids: missingUserIDs.toArray(),
      })
    );
  }
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

      await getMissingUserIDs({
        items: issues,
        getState,
        dispatch,
      });

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
export const FETCH_GET_ISSUE_START = "FETCH_GET_ISSUE_START";

export const FETCH_GET_ISSUE_FAIL = "FETCH_GET_ISSUE_FAIL";

export const FETCH_GET_ISSUE_COMPLETE = "FETCH_GET_ISSUE_COMPLETE";

/**
 * Action creator for fetching issues
 *
 * @param {object} args
 * @param {number} args.id the ID of the issue to get
 * @param {number} args.includeComments if true, will also get all comments
 * on the issue
 *
 * @return {function} an action creator function
 */
export function fetchIssue({ id, includeComments = false }) {
  return async (dispatch, getState) => {
    try {
      dispatch({
        type: FETCH_GET_ISSUE_START,
        payload: {
          id,
        },
        api: {
          callName: "fetchIssue",
          status: "started",
        },
      });

      const issue = await api.getIssue({ id, includeComments });

      await getMissingUserIDs({
        items: List.of(issue),
        getState,
        dispatch,
      });

      dispatch({
        type: FETCH_GET_ISSUE_COMPLETE,
        payload: {
          issue,
        },
        api: {
          callName: "fetchIssue",
          status: "complete",
        },
      });
    } catch (ex) {
      dispatch({
        type: FETCH_GET_ISSUE_FAIL,
        payload: {
          id,
        },
        api: {
          callName: "fetchIssue",
          status: "complete",
        },
        error: ex,
      });

      throw ex;
    }
  };
}

export const FETCH_GET_ISSUE_COMMENTS_START = "FETCH_GET_ISSUE_COMMENTS_START";

export const FETCH_GET_ISSUE_COMMENTS_FAIL = "FETCH_GET_ISSUE_COMMENTS_FAIL";

export const FETCH_GET_ISSUE_COMMENTS_COMPLETE =
  "FETCH_GET_ISSUE_COMMENTS_COMPLETE";

/**
 * Action creator for fetching issue comments
 *
 * @param {object} args
 * @param {number} args.issueID the ID of the issue for which to get comments
 *
 * @return {function} an action creator function
 */
export function fetchIssueComments({ issueID }) {
  return async (dispatch, getState) => {
    try {
      dispatch({
        type: FETCH_GET_ISSUE_COMMENTS_START,
        payload: {
          issueID,
        },
        api: {
          callName: "fetchIssueComments",
          status: "started",
        },
      });

      const issueComments = await api.getIssueComments({ issueID });

      await getMissingUserIDs({
        items: issueComments,
        getState,
        dispatch,
      });

      dispatch({
        type: FETCH_GET_ISSUE_COMMENTS_COMPLETE,
        payload: {
          issueComments,
          issueID,
        },
        api: {
          callName: "fetchIssueComments",
          status: "complete",
        },
      });

      return issueComments;
    } catch (ex) {
      dispatch({
        type: FETCH_GET_ISSUE_COMMENTS_FAIL,
        payload: {
          issueID,
        },
        api: {
          callName: "fetchIssueComments",
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

      return issue;
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


export const FETCH_CREATE_ISSUE_COMMENT_START =
  "FETCH_CREATE_ISSUE_COMMENT_START";

export const FETCH_CREATE_ISSUE_COMMENT_FAIL =
  "FETCH_CREATE_ISSUE_COMMENT_FAIL";

export const FETCH_CREATE_ISSUE_COMMENT_COMPLETE =
  "FETCH_CREATE_ISSUE_COMMENT_COMPLETE";

/**
 * Action creator for creating an issue comment
 *
 * @param {object} args
 * @param {object} args.issueID the ID of the issue with which to associate
 * this comment
 * @param {object} args.commentData the comment to create
 *
 * @return {function} an action creator function
 */
export function addIssueComment({ issueID, commentData }) {
  return async (dispatch) => {
    try {
      dispatch({
        type: FETCH_CREATE_ISSUE_COMMENT_START,
        payload: commentData,
        api: {
          callName: "createIssueComment",
          status: "started",
        },
      });

      const comment = await api.createIssueComment({
        issueID,
        commentData,
      });

      dispatch({
        type: FETCH_CREATE_ISSUE_COMMENT_COMPLETE,
        payload: {
          issueID,
          comment,
        },
        api: {
          callName: "createIssueComment",
          status: "complete",
        },
      });

      await dispatch(
        fetchIssueComments({ issueID })
      );

      return comment;
    } catch (ex) {
      dispatch({
        type: FETCH_CREATE_ISSUE_COMMENT_FAIL,
        payload: {
          issueID,
          commentData,
        },
        api: {
          callName: "createIssueComment",
          status: "complete",
        },
        error: ex,
      });

      throw ex;
    }
  };
}

export const FETCH_SEARCH_ISSUES_START =
  "FETCH_SEARCH_ISSUES_START";

export const FETCH_SEARCH_ISSUES_FAIL =
  "FETCH_SEARCH_ISSUES_FAIL";

export const FETCH_SEARCH_ISSUES_COMPLETE =
  "FETCH_SEARCH_ISSUES_COMPLETE";

/**
 * Action creator for creating an issue comment
 *
 * @param {object} args
 * @param {object} args.searchQuery the query to search
 *
 * @return {function} an action creator function
 */
export function searchIssues({ searchQuery }) {
  return async (dispatch) => {
    try {
      dispatch({
        type: FETCH_SEARCH_ISSUES_START,
        payload: {
          searchQuery,
        },
        api: {
          callName: "searchIssues",
          status: "started",
        },
      });

      const results = await api.searchIssues({
        searchQuery,
      });

      dispatch({
        type: FETCH_SEARCH_ISSUES_COMPLETE,
        payload: {
          results,
        },
        api: {
          callName: "searchIssues",
          status: "complete",
        },
      });

      return results;
    } catch (ex) {
      dispatch({
        type: FETCH_SEARCH_ISSUES_FAIL,
        payload: {
          searchQuery,
        },
        api: {
          callName: "searchIssues",
          status: "complete",
        },
        error: ex,
      });

      throw ex;
    }
  };
}

