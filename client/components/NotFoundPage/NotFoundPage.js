import React from "react";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import withStyles from "@material-ui/core/styles/withStyles";

const styles = {
  root: {
    width: "100%",
    height: "100%",
  },
};

const NotFoundPage = ({ classes }) => {
  return (
    <Grid container
      justify="center"
      alignContent="center"
      className={classes.root}
    >
      Page not found
    </Grid>
  );
};

NotFoundPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

const StyledNotFoundPage = withStyles(styles)(NotFoundPage);

export { StyledNotFoundPage as NotFoundPage };
