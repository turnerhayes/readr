import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { Route, Switch } from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Grid, withStyles } from "@material-ui/core";
import { MuiPickersUtilsProvider } from "material-ui-pickers";
import { useMappedState } from "redux-react-hook";
import DateFnsUtils from "@date-io/date-fns";

import { requireLogin } from "+app/components/requireLogin";
import { Home } from "+app/components/Home";
import { TopNav } from "+app/components/TopNav";
import {
  RentPaymentsContainer as RentPayments,
} from "+app/components/RentPayments";
import { Issues } from "+app/components/Issues";
import { IssueDetailContainer } from "+app/components/IssueDetail";
import { AddIssueContainer } from "+app/components/AddIssue";
import { LoginPage } from "+app/components/LoginPage";
import { isLoggedIn as isLoggedInSelector } from "+app/selectors/auth";

const styles = {
  root: {
    width: "100%",
    height: "100%",
  },

  mainContent: {
    flex: 1,
    overflow: "hidden",
  },
};

// Do not use PureComponent; messes with react-router
/**
 * Main App component.
 */
class App extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  }

  /**
   * Renders the component.
   *
   * @return {React.ReactElement}
   */
  render() {
    return (
      <Grid container
        direction="column"
        wrap="nowrap"
        className={this.props.classes.root}
      >
        <MuiPickersUtilsProvider
          utils={DateFnsUtils}
        >
          <CssBaseline />
          <Grid item>
            <TopNav />
          </Grid>
          <Grid item
            className={this.props.classes.mainContent}
          >
            <Switch>
              <Route
                exact path="/rent"
                component={requireLogin(RentPayments)}
              />
              <Route
                exact path="/issues/add"
                component={requireLogin(AddIssueContainer)}
              />
              <Route
                exact path="/issues/:issueID"
                component={requireLogin(({ match, ...props }) => (
                  <IssueDetailContainer
                    id={Number(match.params.issueID)}
                    {...props}
                  />
                ))}
              />
              <Route
                exact path="/issues"
                component={requireLogin(Issues)}
              />
              <Route
                exact path="/"
                component={requireLogin(Home)}
              />
            </Switch>
          </Grid>
        </MuiPickersUtilsProvider>
      </Grid>
    );
  }
}

const StyledApp = withStyles(styles)(App);

export { StyledApp as App };

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
      <StyledApp
        {...props}
      />
    );
  }

  return (
    <LoginPage />
  );
};

export { AppContainer };

