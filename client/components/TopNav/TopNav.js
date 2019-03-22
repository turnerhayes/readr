import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";

const styles = {
  grow: {
    flexGrow: 1,
  },
};

/**
 * Top application bar component
 *
 * @param {object} props
 * @param {object} props.classes class names for the component
 *
 * @return {React.ReactElement}
 */
function TopNav({ classes }) {
  return (
    <AppBar
      position="static"
    >
      <Toolbar>
        <Typography
          variant="h6"
          color="inherit"
          className={classes.grow}
        >
          Fief
        </Typography>
        <Button
          component={Link}
          color="inherit"
          to="/rent"
        >
          Rent Payments
        </Button>
      </Toolbar>
    </AppBar>
  );
}

TopNav.propTypes = {
  classes: PropTypes.shape({
    grow: PropTypes.string.isRequired,
  }).isRequired,
};

const StyledTopNav = withStyles(styles)(TopNav);

export { StyledTopNav as TopNav };
