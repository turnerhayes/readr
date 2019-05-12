import React, { useCallback } from "react";
import { useMappedState } from "redux-react-hook";
import { Link } from "react-router-dom";
import { Grid, Button, Typography } from "@material-ui/core";

import {
  linkURLForNewIssues,
  linkURLForNewComments,
  newIssueCount,
  newCommentCount,
  stateWithDedupedActivity,
} from "+app/selectors/viewActivity";

/**
 * Home component
 *
 * @return {React.ReactElement}
 */
export function Home() {
  const mapStateToProps = useCallback(
    (state) => {
      const deduped = stateWithDedupedActivity(state);

      return {
        issuesURL: linkURLForNewIssues(deduped),
        commentsURL: linkURLForNewComments(deduped),
        newIssueCount: newIssueCount(deduped),
        newCommentCount: newCommentCount(deduped),
      };
    },
    []
  );

  const {
    issuesURL,
    commentsURL,
  } = useMappedState(mapStateToProps);

  return (
    <Grid container
      direction="column"
    >
      {
        issuesURL === null ?
          null :
          (
            <Grid item>
              <Link
                to={issuesURL}
                component={Button}
              >
                New Issues
              </Link>
            </Grid>
          )
      }
      {
        commentsURL === null ?
          null :
          (
            <Grid item>
              <Link
                to={commentsURL}
                component={Button}
              >
                New Comments
              </Link>
            </Grid>
          )
      }
      {
        issuesURL === null && commentsURL === null && (
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
