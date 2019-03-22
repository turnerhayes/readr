import { combineReducers } from "redux";

import { rentReducer } from "./rent";
import { UIReducer } from "./ui";

export const reducer = combineReducers({
  rent: rentReducer,
  ui: UIReducer,
});
