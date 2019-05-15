import React, { useCallback, useState } from "react";
import { useMappedState } from "redux-react-hook";
import { IconButton, Icon } from "@material-ui/core";

import {
  SnowForecastDialog,
} from "+app/components/SnowForecastIndicator/SnowForecastDialog";

export const SnowForecastIndicator = () => {
  const mapStateToProps = useCallback(
    (state) => ({
      isSnowComing: state.weather && !state.weather.isEmpty(),
    }),
    []
  );

  const {
    isSnowComing,
  } = useMappedState(mapStateToProps);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleButtonClick = useCallback(
    () => setIsDialogOpen(true),
    []
  );

  const handleDialogClose = useCallback(
    () => setIsDialogOpen(false),
    []
  );

  if (isSnowComing) {
    return (
      <div>
        <IconButton
          color="inherit"
          onClick={handleButtonClick}
        >
          <Icon
            title="Snow is expected"
            aria-label="Snow is expected"
          >
            ❄
          </Icon>
        </IconButton>
        {
          isDialogOpen && (
            <SnowForecastDialog
              onClose={handleDialogClose}
            />
          )
        }
      </div>
    );
  }

  return null;
};
