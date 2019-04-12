import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import { Typography, IconButton, withStyles } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

import { IssuesGridContainer } from "+app/components/IssuesGrid";


const styles = {
  root: {
    height: "100%",
  },

  gridContainer: {
    flex: 1,
    minHeight: 0,
  },

  grid: {
    maxHeight: "100%",
  },
};

/**
 * Issues page component
 */
class Issues extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  }

  /**
   * Renders the component
   *
   * @return {JSX.Element}
   */
  render() {
    return (
      <Grid container
        direction="column"
        wrap="nowrap"
        className={this.props.classes.root}
      >
        <Grid item container
          justify="space-between"
        >
          <Grid item>
            <Typography
              variant="h2"
            >Issues</Typography>
          </Grid>
          <Grid item>
            <IconButton
              component={Link}
              to="/issues/add"
              title="Add an issue"
              aria-label="Add an issue"
            >
              <AddIcon />
            </IconButton>
          </Grid>
        </Grid>
        <Grid item
          className={this.props.classes.gridContainer}
        >
          <IssuesGridContainer
            className={this.props.classes.grid}
          />
        </Grid>
      </Grid>
    );
  }
}

const StyledIssuesPage = withStyles(styles)(Issues);

export { StyledIssuesPage as Issues };
