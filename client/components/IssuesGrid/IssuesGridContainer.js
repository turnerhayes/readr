import React, { useCallback } from "react";
import { useMappedState, useDispatch } from "redux-react-hook";

import { fetchIssues } from "+app/actions";

import { IssuesGrid } from "./IssuesGrid";

export const IssuesGridContainer = (props) => {
  const mapState = useCallback(
    (state) => ({
      issues: state.issues.get("items"),
      isFetched: state.issues.get("isFetched"),
    }),
    []
  );

  const { issues, isFetched } = useMappedState(mapState);

  const dispatch = useDispatch();

  if (!isFetched) {
    dispatch(
      fetchIssues()
    );
  }

  return (
    <IssuesGrid
      {...props}
      issues={issues}
    />
  );
};
