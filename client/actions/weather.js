import { getSnowAlerts as snowAlertsAPI } from "+app/api";

import { createAPIAction } from "./utils";

export const getSnowAlerts = createAPIAction(
  async function getSnowAlerts() {
    return snowAlertsAPI();
  }
);
