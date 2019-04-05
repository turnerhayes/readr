import { connect } from "react-redux";

import { createIssue } from "+app/actions";
import { AddIssue } from "./AddIssue";
import { push } from "connected-react-router";

export const AddIssueContainer = connect(
  null,
  (dispatch) => ({
    async addIssue(issueData) {
      const issue = await dispatch(
        createIssue(issueData)
      );

      dispatch(
        push(`/issues/${issue.get("id")}`)
      );
    },
  })
)(AddIssue);
