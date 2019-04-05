import React from "react";
import { Link } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import { Typography, IconButton } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { IssuesGridContainer } from "+app/components/IssuesGrid";

/**
 * Issues page component
 */
export class Issues extends React.PureComponent {
  /**
   * Renders the component
   *
   * @return {JSX.Element}
   */
  render() {
    return (
      <Grid container
        direction="column"
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
        <Grid item>
          <IssuesGridContainer />
        </Grid>
      </Grid>
    );
  }
}
