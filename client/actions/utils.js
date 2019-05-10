const FETCH_START = "FETCH_START";

const FETCH_FAIL = "FETCH_FAIL";

const FETCH_COMPLETE = "FETCH_COMPLETE";

/**
 * Returns an action creator function
 *
 * @param {function} executeAPICall the function to call on the API
 *
 * @return {function} an action creator function
 */
export function createAPIAction(
  executeAPICall,
) {
  if (!executeAPICall.name) {
    throw new Error("`executeAPICall` function must have a name");
  }

  const actionTypes = Object.freeze({
    start: `${FETCH_START}/${executeAPICall.name}`,
    fail: `${FETCH_FAIL}/${executeAPICall.name}`,
    complete: `${FETCH_COMPLETE}/${executeAPICall.name}`,
  });

  const actionCreator = function(...args) {
    return async (dispatch, getState) => {
      try {
        dispatch({
          type: actionTypes.start,
          payload: args,
          meta: {
            api: {
              callName: executeAPICall.name,
              status: "started",
            },
          },
        });

        let result = await executeAPICall(
          ...args
        );

        if (typeof result === "function") {
          result = await result(dispatch, getState);
        }

        dispatch({
          type: actionTypes.complete,
          payload: result,
          meta: {
            api: {
              callName: executeAPICall.name,
              status: "complete",
            },
          },
        });

        return result;
      } catch (ex) {
        dispatch({
          type: actionTypes.fail,
          payload: args,
          meta: {
            api: {
              callName: executeAPICall.name,
              status: "complete",
            },
          },
          error: ex,
        });

        throw ex;
      }
    };
  };

  Object.defineProperty(
    actionCreator,
    "name",
    {
      value: executeAPICall.name,
    }
  );

  Object.defineProperty(
    actionCreator,
    "actionTypes",
    {
      value: actionTypes,
    }
  );

  return actionCreator;
}
