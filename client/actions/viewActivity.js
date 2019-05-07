import * as api from "+app/api";

export const FETCH_NEW_ACTIVITY_START =
  "FETCH_NEW_ACTIVITY_START";

export const FETCH_NEW_ACTIVITY_FAIL =
  "FETCH_NEW_ACTIVITY_FAIL";

export const FETCH_NEW_ACTIVITY_COMPLETE =
  "FETCH_NEW_ACTIVITY_COMPLETE";

/**
 * Action creator for getting new issue activity for the current user.
 *
 * @return {function} an action creator function
 */
export function getNewActivity() {
  return async (dispatch) => {
    try {
      dispatch({
        type: FETCH_NEW_ACTIVITY_START,
        api: {
          callName: "getNewActivity",
          status: "started",
        },
      });

      const newActivity = await api.getNewActivity();

      dispatch({
        type: FETCH_NEW_ACTIVITY_COMPLETE,
        payload: {
          newActivity,
        },
        api: {
          callName: "getNewActivity",
          status: "complete",
        },
      });

      return newActivity;
    } catch (ex) {
      dispatch({
        type: FETCH_NEW_ACTIVITY_FAIL,
        api: {
          callName: "markIssueSeen",
          status: "complete",
        },
        error: ex,
      });

      throw ex;
    }
  };
}


export const FETCH_MARK_ISSUE_SEEN_START =
  "FETCH_MARK_ISSUE_SEEN_START";

export const FETCH_MARK_ISSUE_SEEN_FAIL =
  "FETCH_MARK_ISSUE_SEEN_FAIL";

export const FETCH_MARK_ISSUE_SEEN_COMPLETE =
  "FETCH_MARK_ISSUE_SEEN_COMPLETE";

/**
 * Action creator for marking an issue as seen by the current user
 *
 * @param {object} args
 * @param {number} [args.id] the ID of the issue to mark
 * @param {boolean} [args.includeComments] if true, will also mark all the
 * issue's comments as seen by the user
 *
 * @return {function} an action creator function
 */
export function markIssueSeen({ id, includeComments }) {
  return async (dispatch) => {
    try {
      dispatch({
        type: FETCH_MARK_ISSUE_SEEN_START,
        payload: {
          id,
          includeComments,
        },
        api: {
          callName: "markIssueSeen",
          status: "started",
        },
      });

      const markedItems = await api.markIssueSeen({
        id,
        includeComments,
      });

      dispatch({
        type: FETCH_MARK_ISSUE_SEEN_COMPLETE,
        payload: {
          markedItems,
        },
        api: {
          callName: "markIssueSeen",
          status: "complete",
        },
      });

      return markedItems;
    } catch (ex) {
      dispatch({
        type: FETCH_MARK_ISSUE_SEEN_FAIL,
        payload: {
          id,
          includeComments,
        },
        api: {
          callName: "markIssueSeen",
          status: "complete",
        },
        error: ex,
      });

      throw ex;
    }
  };
}
