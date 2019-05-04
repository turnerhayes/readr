import React, { useCallback, useState } from "react";
import { Map, OrderedMap } from "immutable";
import { useMappedState, useDispatch } from "redux-react-hook";
import { Link } from "react-router-dom";
import { Grid, Button, Typography } from "@material-ui/core";

import { fetchIssues } from "+app/actions";

const getNewCommentsLinkURL = (newComments) => {
  if (newComments.size === 1) {
    const issueID = newComments.keySeq().first();

    return `/issues/${issueID}?comment=${newComments.get(issueID).first()}`;
  }

  return "/issues";
};

const getNewIssuesLinkURL = (newIssues) => {
  if (newIssues.size === 1) {
    const issueID = newIssues.keySeq().first();

    return `/issues/${issueID}`;
  }

  return "/issues";
};

/**
 * Home component
 *
 * @return {React.ReactElement}
 */
export function Home() {
  const mapStateToProps = useCallback(
    (state) => {
      const issues = state.issues.get("items", Map());

      let newIssues = OrderedMap();
      let newComments = OrderedMap();

      issues.forEach(
        (issue, issueID) => {
          if (issue.get("hasNew")) {
            newIssues = newIssues.set(issueID, issue);
          }
          if (!issue.get("newCommentIDs").isEmpty()) {
            newComments = newComments.set(issueID, issue.get("newCommentIDs"));
          }
        }
      );

      // Remove any comments for new issues
      newComments = newComments.filter(
        (ids, issueID) => !newIssues.has(issueID)
      );

      return {
        newIssues,
        newComments,
      };
    },
    []
  );

  const [hasFetched, setHasFetched] = useState(false);

  const {
    newIssues,
    newComments,
  } = useMappedState(mapStateToProps);

  const dispatch = useDispatch();

  if (!hasFetched) {
    // fetch updates
    dispatch(
      fetchIssues()
    );

    setHasFetched(true);
  }

  return (
    <Grid container
      direction="column"
    >
      {
        newIssues.isEmpty() ?
          null :
          (
            <Grid item>
              <Link
                to={getNewIssuesLinkURL(newIssues)}
                component={Button}
              >
                New Issues
              </Link>
            </Grid>
          )
      }
      {
        newComments.isEmpty() ?
          null :
          (
            <Grid item>
              <Link
                to={getNewCommentsLinkURL(newComments)}
                component={Button}
              >
                New Comments
              </Link>
            </Grid>
          )
      }
      {
        newComments.isEmpty() && newIssues.isEmpty() && (
          <Grid item>
            <Typography
            >
              Nothing new to see
            </Typography>
          </Grid>
        )
      }
    </Grid>
  );
}
