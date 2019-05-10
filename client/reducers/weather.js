import { OrderedMap } from "immutable";

import {
  getSnowAlerts,
} from "+app/actions";

export const WeatherReducer = (state = OrderedMap(), action) => {
  switch (action.type) {
    case getSnowAlerts.actionTypes.complete: {
      if (action.api.callName === getSnowAlerts.name) {
        return action.payload;
      }

      return state;
    }
    default: {
      return state;
    }
  }
};
