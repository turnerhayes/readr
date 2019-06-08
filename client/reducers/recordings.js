import { fromJS } from "immutable";

import {
  fetchSample,
} from "+app/actions";

const initialState = fromJS({
  samples: {},
});

export const RecordingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case fetchSample.actionTypes.complete: {
      const { sampleName, sample } = action.payload;

      return state.setIn(["samples", sampleName], sample);
    }
    default: {
      return state;
    }
  }
};
