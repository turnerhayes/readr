import React from "react";
import PropTypes from "prop-types";
import { Route, Switch } from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Grid, withStyles } from "@material-ui/core";

import { Home } from "+app/components/Home";
import { TopNav } from "+app/components/TopNav";
import { RecordingPage } from "+app/components/RecordingPage";
import { LoginPage } from "+app/components/LoginPage";
import { NotFoundPage } from "+app/components/NotFoundPage";

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
        <CssBaseline />
        <Grid item>
          <TopNav />
        </Grid>
        <Grid item container
          direction="column"
          wrap="nowrap"
          className={this.props.classes.mainContent}
        >
          <Switch>
            <Route
              exact path="/login"
              component={LoginPage}
            />
            <Route
              exact path="/record"
              component={RecordingPage}
            />
            <Route
              exact path="/"
              component={Home}
            />
            <Route
              component={NotFoundPage}
            />
          </Switch>
        </Grid>
      </Grid>
    );
  }
}

const StyledApp = withStyles(styles)(App);

export { StyledApp as App };
