import React from "react";
import { Route } from "react-router-dom";

import { Home } from "../Home";

/**
 * Main App component.
 */
export class App extends React.PureComponent {
  /**
   * Renders the component.
   *
   * @return {React.ReactElement}
   */
  render() {
    return (
      <div>
        <Route
          exact path="/"
          component={Home}
        />
      </div>
    );
  }
}
