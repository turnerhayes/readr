import * as api from "+app/api";

export const FETCH_GET_USERS_START = "FETCH_GET_USERS_START";

export const FETCH_GET_USERS_FAIL = "FETCH_GET_USERS_FAIL";

export const FETCH_GET_USERS_COMPLETE = "FETCH_GET_USERS_COMPLETE";

/**
 * Action creator for fetching users
 *
 * @return {function} an action creator function
 */
export function fetchUsers({ ids } = {}) {
  return async (dispatch) => {
    try {
      dispatch({
        type: FETCH_GET_USERS_START,
        payload: {},
        api: {
          callName: "fetchUsers",
          status: "started",
        },
      });

      const users = await api.getUsers({ ids });

      dispatch({
        type: FETCH_GET_USERS_COMPLETE,
        payload: {
          users,
        },
        api: {
          callName: "fetchUsers",
          status: "complete",
        },
      });
    } catch (ex) {
      dispatch({
        type: FETCH_GET_USERS_FAIL,
        api: {
          callName: "fetchUsers",
          status: "complete",
        },
        error: ex,
      });
    }
  };
}
