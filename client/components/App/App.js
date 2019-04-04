import React, { useCallback } from "react";
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
import { Issues } from "+app/components/Issues";
import { IssueDetailContainer } from "+app/components/IssueDetail";
import { LoginPage } from "+app/components/LoginPage";
import { isLoggedIn as isLoggedInSelector } from "+app/selectors/auth";
import { useMappedState } from "redux-react-hook";

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
              exact path="/rent"
              component={requireLogin(RentPayments)}
            />
            <Route
              exact path="/issues/:issueID"
              component={({ match, ...props }) => (
                <IssueDetailContainer
                  id={Number(match.params.issueID)}
                  {...props}
                />
              )}
            />
            <Route
              exact path="/issues"
              component={Issues}
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

const AppContainer = (props) => {
  const mapState = useCallback(
    (state) => ({
      isLoggedIn: isLoggedInSelector(state),
    }),
    []
  );

  const { isLoggedIn } = useMappedState(mapState);

  if (isLoggedIn) {
    return (
      <App
        {...props}
      />
    );
  }

  return (
    <LoginPage />
  );
};

export { AppContainer };

