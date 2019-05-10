import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { useMappedState } from "redux-react-hook";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
} from "@material-ui/core";
import format from "date-fns/format";

export const SnowForecastDialog = ({ onClose }) => {
  const mapStateToProps = useCallback(
    (state) => ({
      snowDays: state.weather,
    }),
    []
  );

  const {
    snowDays,
  } = useMappedState(mapStateToProps);

  return (
    <Dialog
      open
      onClose={onClose}
    >
      <DialogTitle>Snow totals forecast (next 5 days)</DialogTitle>
      <DialogContent>
        <List>
          {
            snowDays.map(
              (snowDepth, date) => (
                <ListItem
                  key={date.getTime()}
                >
                  {
                    format(
                      date,
                      "MMM do"
                    )
                  }: {snowDepth}″
                </ListItem>
              )
            ).valueSeq().toArray()
          }
        </List>
      </DialogContent>
    </Dialog>
  );
};

SnowForecastDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
};
