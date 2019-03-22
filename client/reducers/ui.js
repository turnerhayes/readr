import { Map } from "immutable";

import { SET_UI_STATE } from "+app/actions";

/**
 * UI reducer
 *
 * @param {Immutable.Map} state the initial state
 * @param {object} action the dispatched action
 *
 * @return {Immutable.Map} the modified state
 */
export function UIReducer(state = Map(), action) {
  switch (action.type) {
    case SET_UI_STATE: {
      let { section, key, value } = action.payload;

      if (!Array.isArray(key)) {
        key = [key];
      }

      return state.setIn(
        [
          section,
          ...key,
        ],
        value
      );
    }
    default: {
      return state;
    }
  }
}
