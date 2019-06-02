import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router/immutable";

import { history } from "+app/history";

import { UIReducer } from "./ui";
import { APIReducer } from "./api";
import { UsersReducer } from "./users";
import { RecordingsReducer } from "./recordings";

export const reducer = combineReducers({
  ui: UIReducer,
  api: APIReducer,
  users: UsersReducer,
  recordings: RecordingsReducer,
  router: connectRouter(history),
});
