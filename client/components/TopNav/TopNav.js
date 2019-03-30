import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import HomeIcon from "@material-ui/icons/Home";
import { Link } from "react-router-dom";

const styles = (theme) => ({
  pageLinks: {
    marginRight: "auto",
    marginLeft: theme.spacing.unit * 2,
  },
});

/**
 * Top application bar component
 *
 * @param {object} props
 * @param {object} props.classes class names for the component
 *
 * @return {React.ReactElement}
 */
function TopNav({ classes, location }) {
  const pageLinks = [
    {
      path: "/rent",
      text: "Rent Payments",
    },

    {
      path: "/issues",
      text: "Issues",
    },
  ];

  return (
    <AppBar
      position="static"
    >
      <Toolbar>
        <IconButton
          component={Link}
          to="/"
          color="inherit"
        >
          <HomeIcon />
        </IconButton>
        <Typography
          variant="h6"
          color="inherit"
        >
          Fief
        </Typography>
        <div
          className={classes.pageLinks}
        >
          {
            pageLinks.map(
              ({ path, text }, index) => (
                <Button
                  key={path}
                  component={Link}
                  color="inherit"
                  to={path}
                  disabled={location.pathname === path}
                >
                  {text}
                </Button>
              )
            )
          }
        </div>
      </Toolbar>
    </AppBar>
  );
}

TopNav.propTypes = {
  classes: PropTypes.shape({
    pageLinks: PropTypes.string.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
};

const StyledTopNav = withStyles(styles)(withRouter(TopNav));

export { StyledTopNav as TopNav };
