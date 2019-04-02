import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { routerMiddleware } from "connected-react-router/immutable";

import { reducer } from "+app/reducers";
import { history } from "+app/history";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const middlewares = [
  thunk,
  routerMiddleware(history),
];

// eslint-disable-next-line no-undef
if (process.env.NODE_ENV === "development") {
  const errorMiddleware = () =>(next) => (action) => {
    if (action.error) {
      // eslint-disable-next-line no-console
      console.error(action.error);
    }

    next(action);
  };

  middlewares.push(errorMiddleware);
}

const storeEnhancer = composeEnhancers(
  applyMiddleware(...middlewares)
);

export const store = createStore(
  reducer,
  storeEnhancer
);
