import {
  createAPIAction,
} from "+app/actions/utils";
import * as api from "+app/api";

/**
 * Action creator for fetching users
 *
 * @return {function} an action creator function
 */
export const fetchUsers = createAPIAction(
  async function fetchUsers({ ids } = {}) {
    const users = await api.getUsers({ ids });

    return {
      users,
    };
  }
);
