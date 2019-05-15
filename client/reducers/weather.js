import {
  getSnowAlerts,
} from "+app/actions";

export const WeatherReducer = (state = null, action) => {
  switch (action.type) {
    case getSnowAlerts.actionTypes.complete: {
      return action.payload;
    }
    default: {
      return state;
    }
  }
};
