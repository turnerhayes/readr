import * as api from "+app/api";
import { Set, List } from "immutable";

import {
  getLatestIssueUpdateDate,
} from "+app/selectors/issues";
import {
  createAPIAction,
} from "+app/actions/utils";
import { fetchUsers } from "./users";

const ISSUE_USER_ID_PROPERTIES = [
  "createdBy",
  "updatedBy",
];

const getUserIDsFromIssues = (issues) => {
  return Set().withMutations(
    (idSet) => {
      issues.forEach(
        (issue) => {
          ISSUE_USER_ID_PROPERTIES.forEach(
            (prop) => {
              if (issue.get(prop) !== null) {
                idSet.add(issue.get(prop));
              }
            }
          );

          if (issue.get("comments", List()).size > 0) {
            idSet.concat(getUserIDsFromIssues(issue.get("comments")));
          }
        }
      );
    }
  );
};

const getMissingUsers = async ({
  items,
  getState,
  dispatch,
}) => {
  const referencedUserIDs = getUserIDsFromIssues(items);

  const missingUserIDs = referencedUserIDs.subtract(
    getState().users.get("items").keySeq()
  );

  if (!missingUserIDs.isEmpty()) {
    await dispatch(
      fetchUsers({
        ids: missingUserIDs.toArray(),
      })
    );
  }
};

/**
 * Action creator for fetching issues
 *
 * @param {object} [args]
 * @param {number[]} [args.ids] a list of issue ids to get
 * @param {Date} [args.since] only get comments updated after this date
 *
 * @return {function} an action creator function
 */
export const fetchIssues = createAPIAction(
  async function fetchIssues(
    {
      ids,
      since,
    } = {}
  ) {
    const issues = await api.getIssues({
      ids,
      since,
    });

    return async (dispatch, getState) => {
      await getMissingUsers({
        items: issues,
        getState,
        dispatch,
      });

      return {
        issues,
      };
    };
  }
);

/**
 * Action creator for fetching issues
 *
 * @param {object} args
 * @param {number} args.id the ID of the issue to get
 * @param {number} args.includeComments if true, will also get all comments
 * on the issue
 *
 * @return {function} an action creator function
 */
export const fetchIssue = createAPIAction(
  async function fetchIssue(
    {
      id,
      includeComments = false,
    }
  ) {
    const issue = await api.getIssue({ id, includeComments });

    return async (dispatch, getState) => {
      await getMissingUsers({
        items: List.of(issue),
        getState,
        dispatch,
      });

      return {
        issue,
      };
    };
  }
);

/**
 * Action creator for fetching issue comments
 *
 * @param {object} args
 * @param {number} args.issueID the ID of the issue for which to get comments
 *
 * @return {function} an action creator function
 */
export const fetchIssueComments = createAPIAction(
  async function fetchIssueComments(
    {
      issueID,
    }
  ) {
    const issueComments = await api.getIssueComments({ issueID });

    return async (dispatch, getState) => {
      await getMissingUsers({
        items: issueComments,
        getState,
        dispatch,
      });

      return {
        issueID,
        issueComments,
      };
    };
  }
);

/**
 * Action creator for creating an issue
 *
 * @param {object} issueData the issue to create
 *
 * @return {function} an action creator function
 */
export const createIssue = createAPIAction(
  async function createIssue(
    {
      issueData,
    }
  ) {
    const issue = await api.createIssue(issueData);

    return {
      issue,
    };
  }
);

/**
 * Action creator for updating an issue
 *
 * @param {object} args
 * @param {number} args.issueID the ID of the issue to update
 * @param {object} args.updates a map of properties to update
 *
 * @return {function} an action creator function
 */
export const updateIssue = createAPIAction(
  async function updateIssue(
    {
      issueID,
      updates,
    }
  ) {
    const issue = await api.updateIssue({
      issueID,
      updates,
    });

    return {
      issue,
    };
  }
);

/**
 * Action creator for creating an issue comment
 *
 * @param {object} args
 * @param {object} args.issueID the ID of the issue with which to associate
 * this comment
 * @param {object} args.commentData the comment to create
 *
 * @return {function} an action creator function
 */
export const addIssueComment = createAPIAction(
  async function addIssueComment(
    {
      issueID,
      commentData,
    }
  ) {
    const comment = await api.createIssueComment({
      issueID,
      commentData,
    });

    return {
      issueID,
      comment,
    };
  }
);

/**
 * Action creator for creating an issue comment
 *
 * @param {object} args
 * @param {string} [args.searchQuery] the query to search
 * @param {string[]} [args.statuses] results must be in one of these statuses
 * @param {string[]} [args.activityBy] results must contain some action taken
 * by one of these users (either the issue or one of its comments)
 *
 * @return {function} an action creator function
 */
export const searchIssues = createAPIAction(
  async function searchIssues(
    {
      searchQuery,
      statuses,
      activityBy,
    }
  ) {
    const results = await api.searchIssues({
      searchQuery,
      statuses,
      activityBy,
    });

    return {
      results,
    };
  }
);

export const ISSUES_CLEAR_SEARCH_RESULTS = "ISSUES_CLEAR_SEARCH_RESULTS";

export const clearIssuesSearchResults = () => {
  return {
    type: ISSUES_CLEAR_SEARCH_RESULTS,
  };
};

/**
 * Action creator for getting issues that haven't been fetched yet.
 *
 * @return {function} an action creator function
 */
export function getNewIssues() {
  return async (dispatch, getState) => {
    const latestUpdateDate = getLatestIssueUpdateDate(getState());

    return fetchIssues({
      since: latestUpdateDate,
    });
  };
}
