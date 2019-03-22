import React from "react";
import { Route } from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline"

import { Home } from "+app/components/Home";
import { TopNav } from "+app/components/TopNav";
import {
  RentPaymentsContainer as RentPayments,
} from "+app/components/RentPayments";

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
        <CssBaseline />
        <TopNav />
        <Route
          exact path="/"
          component={Home}
        />
        <Route
          exact path="/rent"
          component={RentPayments}
        />
      </div>
    );
  }
}
