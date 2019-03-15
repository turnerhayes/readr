import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";

import { reducer } from "+app/reducers";

const middleware = applyMiddleware(thunk);

export const store = createStore(
  reducer,
  middleware
);
