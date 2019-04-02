import React from "react";
import Grid from "@material-ui/core/Grid";
import { Typography } from "@material-ui/core";
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
        <Typography
          variant="h2"
        >Issues</Typography>

        <IssuesGridContainer
        />
      </Grid>
    );
  }
}
