import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { useMappedState, useDispatch } from "redux-react-hook";

import { IssueDetail } from "./IssueDetail";
import {
  fetchIssue,
  updateIssue,
  fetchIssueComments,
  addIssueComment,
} from "+app/actions";
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

  const addCommentCallback = useCallback(
    (commentData) => {
      return dispatch(
        addIssueComment({
          issueID: id,
          commentData,
        })
      );
    },
    [dispatch, id]
  );

  if (!issue) {
    dispatch(
      fetchIssue({
        id,
      })
    );

    dispatch(
      fetchIssueComments({
        issueID: id,
      })
    );

    return null;
  }

  return (
    <IssueDetail
      issue={issue}
      updateIssue={updateIssueCallback}
      addComment={addCommentCallback}
    />
  );
};

IssueDetailContainer.propTypes = {
  id: PropTypes.number.isRequired,
};

