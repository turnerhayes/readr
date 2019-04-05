import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import { useMappedState } from "redux-react-hook";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Popper from "@material-ui/core/Popper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import HomeIcon from "@material-ui/icons/Home";
import PersonIcon from "@material-ui/icons/Person";
import { Link } from "react-router-dom";

import { AccountDropDown } from "+app/components/AccountDropDown";
import { isLoggedIn as isLoggedInSelector } from "+app/selectors/auth";

const AccountDropDownTrigger = ({ className }) => {
  const [state, setState] = useState({
    anchorEl: null,
    isPopperOpen: false,
  });

  const handleClick = useCallback(
    ({ currentTarget }) => setState({
      anchorEl: currentTarget,
      isPopperOpen: true,
    }),
    []
  );

  const handleClickAway = useCallback(
    () => setState({
      isPopperOpen: false,
    }),
    []
  );

  return (
    <IconButton
      color="inherit"
      onClick={handleClick}
      className={className}
    >
      <PersonIcon />
      <Popper
        anchorEl={state.anchorEl}
        open={state.isPopperOpen}
      >
        <ClickAwayListener
          onClickAway={handleClickAway}
        >
          <AccountDropDown />
        </ClickAwayListener>
      </Popper>
    </IconButton>
  );
};

AccountDropDownTrigger.propTypes = {
  className: PropTypes.string,
};

const styles = (theme) => ({
  accountIcon: {
    marginLeft: "auto",
  },

  pageLinks: {
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

  const mapState = useCallback(
    (state) => ({
      isLoggedIn: isLoggedInSelector(state),
    }),
    []
  );

  const { isLoggedIn } = useMappedState(mapState);

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
              ({ path, text }) => (
                <Button
                  key={path}
                  component={Link}
                  color="inherit"
                  to={path}
                  disabled={
                    location.pathname === path
                  }
                >
                  {text}
                </Button>
              )
            )
          }
        </div>
        {
          isLoggedIn && (
            <AccountDropDownTrigger
              className={classes.accountIcon}
            />
          )
        }
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
