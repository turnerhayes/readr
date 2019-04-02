import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router/immutable";

import { history } from "+app/history";

import { rentReducer } from "./rent";
import { UIReducer } from "./ui";
import { APIReducer } from "./api";
import { UsersReducer } from "./users";
import { IssuesReducer } from "./issues";

export const reducer = combineReducers({
  rent: rentReducer,
  ui: UIReducer,
  api: APIReducer,
  users: UsersReducer,
  issues: IssuesReducer,
  router: connectRouter(history),
});
