export const SET_UI_STATE = "SET_UI_STATE";

/**
 * Action creator for the SET_UI_STATE action.
 *
 * @param {object} args
 * @param {string} args.section the name of the UI section
 * @param {string|string[]} args.key the key or key path) of the state to set
 * @param {*} args.value the value to set
 *
 * @return {object} the action
 */
export function setUIState({ section, key, value }) {
  if (!section) {
    throw new Error(
      "The setUIState action creator requires a `section` parameter"
    );
  }

  if (!key || !(typeof key === "string" || Array.isArray(key))) {
    throw new Error(
      "The setUIState action creator `key` parameter must be a string or array"
    );
  }

  return {
    type: SET_UI_STATE,
    payload: {
      section,
      key,
      value,
    },
  };
}
