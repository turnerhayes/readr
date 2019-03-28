import { combineReducers } from "redux";

import { rentReducer } from "./rent";
import { UIReducer } from "./ui";
import { APIReducer } from "./api";

export const reducer = combineReducers({
  rent: rentReducer,
  ui: UIReducer,
  api: APIReducer,
});
