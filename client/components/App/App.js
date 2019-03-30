import React from "react";
import { Route, Switch } from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import { MuiPickersUtilsProvider } from "material-ui-pickers";
import DateFnsUtils from "@date-io/date-fns";

import { Home } from "+app/components/Home";
import { TopNav } from "+app/components/TopNav";
import {
  RentPaymentsContainer as RentPayments,
} from "+app/components/RentPayments";
import { Issues } from "+app/components/Issues";

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
        <MuiPickersUtilsProvider
          utils={DateFnsUtils}
        >
          <CssBaseline />
          <TopNav />
          <Switch>
            <Route
              exact path="/rent"
              component={RentPayments}
            />
            <Route
              exact path="/Issues"
              component={Issues}
            />
            <Route
              exact path="/"
              component={Home}
            />
          </Switch>
        </MuiPickersUtilsProvider>
      </div>
    );
  }
}
