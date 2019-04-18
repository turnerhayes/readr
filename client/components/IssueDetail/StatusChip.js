import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";
import Chip from "@material-ui/core/Chip";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import MenuList from "@material-ui/core/MenuList";
import MenuItem from "@material-ui/core/MenuItem";
import Popper from "@material-ui/core/Popper";
import Paper from "@material-ui/core/Paper";

const STATUS_VALUES = [
  "new",
  "blocked",
  "closed",
];


export const StatusChip = ({ currentStatus, onChange }) => {
  const [state, setState] = useState({
    isOpen: false,
    anchorEl: null,
  });

  const close = useCallback(
    () => setState({
      isOpen: false,
      anchorEl: null,
    }),
    []
  );

  const handleClick = useCallback(
    ({ currentTarget }) => setState({
      isOpen: true,
      anchorEl: currentTarget,
    }),
    []
  );

  const handleSelect = useCallback(
    ({ value }) => {
      onChange({ value });

      close();
    },
    [close, onChange]
  );

  return (
    <React.Fragment>
      <Chip
        label={currentStatus}
        onClick={handleClick}
      />
      <Popper
        open={state.isOpen}
        anchorEl={state.anchorEl}
        placement="bottom-start"
        transition
      >
        {
          ({ TransitionProps }) => (
            <Grow
              {...TransitionProps}
            >
              <Paper>
                <ClickAwayListener
                  onClickAway={close}
                >
                  <MenuList>
                    {
                      STATUS_VALUES.map(
                        (status) => status === currentStatus ?
                          null : (
                            <MenuItem
                              key={status}
                              value={status}
                              onClick={() => handleSelect({ value: status })}
                            >
                              {status}
                            </MenuItem>
                          )
                      )
                    }
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )
        }
      </Popper>
    </React.Fragment>
  );
};

StatusChip.propTypes = {
  currentStatus: PropTypes.oneOf(STATUS_VALUES).isRequired,
  onChange: PropTypes.func.isRequired,
};
