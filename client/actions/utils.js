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
          api: {
            callName: executeAPICall.name,
            status: "started",
          },
        });

        const result = await executeAPICall(
          ...args,
        );

        dispatch({
          type: actionTypes.complete,
          payload: result,
          api: {
            callName: executeAPICall.name,
            status: "complete",
          },
        });
      } catch (ex) {
        dispatch({
          type: actionTypes.fail,
          payload: args,
          api: {
            callName: executeAPICall.name,
            status: "complete",
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
