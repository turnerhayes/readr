import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router/immutable";

import { history } from "+app/history";

import { rentReducer } from "./rent";
import { UIReducer } from "./ui";
import { APIReducer } from "./api";
import { UsersReducer } from "./users";
import { IssuesReducer } from "./issues";
import { viewActivityReducer } from "./viewActivity";
import { WeatherReducer } from "./weather";

export const reducer = combineReducers({
  rent: rentReducer,
  ui: UIReducer,
  api: APIReducer,
  users: UsersReducer,
  issues: IssuesReducer,
  viewActivity: viewActivityReducer,
  weather: WeatherReducer,
  router: connectRouter(history),
});
