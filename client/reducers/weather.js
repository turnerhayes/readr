import { OrderedMap } from "immutable";

import {
  getSnowAlerts,
} from "+app/actions";

export const WeatherReducer = (state = OrderedMap(), action) => {
  switch (action.type) {
    case getSnowAlerts.actionTypes.complete: {
      return action.payload;
    }
    default: {
      return state;
    }
  }
};
