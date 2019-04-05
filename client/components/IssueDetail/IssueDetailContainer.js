import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { useMappedState, useDispatch } from "redux-react-hook";

import { IssueDetail } from "./IssueDetail";
import { fetchIssues, updateIssue } from "+app/actions";
import { getIssue } from "+app/selectors/issues";

export const IssueDetailContainer = ({ id }) => {
  const mapState = useCallback(
    (state) => ({
      issue: getIssue(state, { id }),
    }),
    [id]
  );

  const { issue } = useMappedState(mapState);

  const dispatch = useDispatch();

  const updateIssueCallback = useCallback(
    (updates) => {
      dispatch(
        updateIssue({
          issueID: id,
          updates,
        })
      );
    },
    [dispatch, id]
  );

  if (!issue) {
    dispatch(
      fetchIssues({
        ids: [id],
      })
    );

    return null;
  }

  return (
    <IssueDetail
      issue={issue}
      updateIssue={updateIssueCallback}
    />
  );
};

IssueDetailContainer.propTypes = {
  id: PropTypes.number.isRequired,
};

