import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";

import { reducer } from "+app/reducers";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const storeEnhancer = composeEnhancers(
  applyMiddleware(thunk)
);

export const store = createStore(
  reducer,
  storeEnhancer
);
