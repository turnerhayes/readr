import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";
import Popover from "@material-ui/core/Popover";
import IconButton from "@material-ui/core/IconButton";
import FilterIcon from "@material-ui/icons/FilterList";

export const FilterTrigger = ({ children }) => {
  const [state, setState] = useState({
    isDropdownOpen: false,
    anchorEl: null,
  });

  const stopPropagation = useCallback(
    (event) => event.stopPropagation(),
    []
  );

  const handleClick = useCallback(
    (event) => {
      const { currentTarget } = event;
      stopPropagation(event);

      setState((prevState) => ({
        isDropdownOpen: !prevState.isDropdownOpen,
        anchorEl: currentTarget,
      }));
    },
    [stopPropagation]
  );

  const handleClose = useCallback(
    (event) => {
      stopPropagation(event);

      setState({
        isDropdownOpen: false,
        anchorEl: null,
      });
    },
    [stopPropagation]
  );

  return (
    <React.Fragment>
      <IconButton
        onClick={handleClick}
      >
        <FilterIcon />
      </IconButton>
      <Popover
        open={state.isDropdownOpen}
        anchorEl={state.anchorEl}
        onClose={handleClose}
        // Prevent clicks within the content from leaking outside of the popover
        onClick={stopPropagation}
      >
        {children}
      </Popover>
    </React.Fragment>
  );
};

FilterTrigger.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(
      PropTypes.node
    ),
  ]),
};
