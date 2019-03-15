import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import {
  BrowserRouter as Router,
} from "react-router-dom";

import { store } from "+app/store/configure-store";
import { App } from "+app/components/App";

render(
  (
    <Provider
      store={store}
    >
      <Router>
        <App>
        </App>
      </Router>
    </Provider>
  ),
  document.getElementById("app")
);
