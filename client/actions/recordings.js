import { createAPIAction } from "./utils";
import * as api from "+app/api";

export const fetchSample = createAPIAction(
  "fetchSample",
  async ({ sampleName }) => {
    const sample = await api.fetchSample({ sampleName });

    return {
      sample,
      sampleName,
    };
  }
);
