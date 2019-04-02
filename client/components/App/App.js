import React from "react";
import { Route, Switch } from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import { MuiPickersUtilsProvider } from "material-ui-pickers";
import DateFnsUtils from "@date-io/date-fns";

import { requireLogin } from "+app/components/requireLogin";
import { Home } from "+app/components/Home";
import { TopNav } from "+app/components/TopNav";
import {
  RentPaymentsContainer as RentPayments,
} from "+app/components/RentPayments";
import { LoginPage } from "+app/components/LoginPage";

// Do not use PureComponent; messes with react-router
/**
 * Main App component.
 */
export class App extends React.Component {
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
              exact path="/login"
              component={LoginPage}
            />
            <Route
              exact path="/rent"
              component={requireLogin(RentPayments)}
            />
            <Route
              exact path="/"
              component={requireLogin(Home)}
            />
          </Switch>
        </MuiPickersUtilsProvider>
      </div>
    );
  }
}
