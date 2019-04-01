import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { routerMiddleware } from "connected-react-router/immutable";

import { reducer } from "+app/reducers";
import { history } from "+app/history";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const storeEnhancer = composeEnhancers(
  applyMiddleware(
    thunk,
    routerMiddleware(history)
  )
);

export const store = createStore(
  reducer,
  storeEnhancer
);
