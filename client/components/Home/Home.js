import React, { useCallback, useState } from "react";
import { useMappedState, useDispatch } from "redux-react-hook";
import { Link } from "react-router-dom";
import { Grid, Button, Typography } from "@material-ui/core";

import { fetchIssues } from "+app/actions";
import {
  linkURLForNewComments,
  linkURLForNewIssues,
} from "+app/selectors/activity";

// Use a single object for params so that reselect can use memoized
// result with object equality comparison
const commentsSelectorOptions = {
  dedupe: true,
};

/**
 * Home component
 *
 * @return {React.ReactElement}
 */
export function Home() {
  const mapStateToProps = useCallback(
    (state) => {
      return {
        issuesURL: linkURLForNewIssues(state, commentsSelectorOptions),
        commentsURL: linkURLForNewComments(state, commentsSelectorOptions),
      };
    },
    []
  );

  const [hasFetched, setHasFetched] = useState(false);

  const {
    issuesURL,
    commentsURL,
  } = useMappedState(mapStateToProps);

  const dispatch = useDispatch();

  if (!hasFetched) {
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
