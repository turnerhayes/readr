import { store } from "+app/store/configure-store";
import {
  getNewActivity,
} from "+app/actions";

// 5 minute interval
// const POLL_DELAY_MS = 1000 * 60 * 5;
const POLL_DELAY_MS = 1000 * 60 * 1;

let timeoutHandle = null;

const timeoutCallback = async () => {
  await store.dispatch(
    getNewActivity()
  );

  timeoutHandle = setTimeout(
    timeoutCallback,
    POLL_DELAY_MS
  );
};


export const start = () => {
  if (!timeoutHandle) {
    timeoutHandle = setTimeout(
      timeoutCallback,
      POLL_DELAY_MS
    );
  }
};

export const stop = () => {
  if (timeoutHandle) {
    clearTimeout(timeoutHandle);
  }
};
