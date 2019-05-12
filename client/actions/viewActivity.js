import {
  createAPIAction,
} from "+app/actions/utils";
import * as api from "+app/api";

/**
 * Action creator for getting new issue activity for the current user.
 *
 * @return {function} an action creator function
 */
export const getNewActivity = createAPIAction(
  "getNewActivity",
  async () => {
    const newActivity = await api.getNewActivity();

    return {
      newActivity,
    };
  }
);

/**
 * Action creator for marking an issue as seen by the current user
 *
 * @param {object} args
 * @param {number} [args.id] the ID of the issue to mark
 * @param {boolean} [args.includeComments] if true, will also mark all the
 * issue's comments as seen by the user
 *
 * @return {function} an action creator function
 */
export const markIssueSeen = createAPIAction(
  "markIssueSeen",
  async (
    {
      id,
      includeComments,
    }
  ) => {
    const markedItems = await api.markIssueSeen({
      id,
      includeComments,
    });

    return {
      markedItems,
    };
  }
);
