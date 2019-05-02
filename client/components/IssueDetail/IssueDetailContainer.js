import React from "react";
import PropTypes from "prop-types";
import ImmutablePropTypes from "react-immutable-proptypes";
import { connect } from "react-redux";

import { IssueDetail } from "./IssueDetail";
import {
  fetchIssue,
  updateIssue,
  fetchIssueComments,
  addIssueComment,
  markIssueSeen,
} from "+app/actions";
import { getIssue } from "+app/selectors/issues";

/**
 * Issue Detail container component
 */
class InnerIssueDetailContainer extends React.PureComponent {
  static propTypes = {
    id: PropTypes.number.isRequired,
    issue: ImmutablePropTypes.map,
    markIssueSeen: PropTypes.func.isRequired,
    fetchIssue: PropTypes.func.isRequired,
    fetchIssueComments: PropTypes.func.isRequired,
  }

  /**
   */
  componentDidMount() {
    this.props.markIssueSeen();

    this.props.fetchIssueComments();
  }

  /**
   * Renders the component.
   *
   * @return {JSX.Element}
   */
  render() {
    const {
      fetchIssue,
      // eslint-disable-next-line no-unused-vars
      fetchIssueComments,
      // eslint-disable-next-line no-unused-vars
      markIssueSeen,
      ...props
    } = this.props;

    if (!props.issue) {
      fetchIssue();

      return null;
    }

    return (
      <IssueDetail
        {...props}
      />
    );
  }
}

const mapStateToProps = (state, { id }) => {
  return {
    issue: getIssue(state, { id }),
  };
};

const mapDispatchToProps = (dispatch, { id }) => {
  return {
    updateIssue(updates) {
      dispatch(
        updateIssue({
          issueID: id,
          updates,
        })
      );
    },

    addComment(commentData) {
      return dispatch(
        addIssueComment({
          issueID: id,
          commentData,
        })
      );
    },

    fetchIssue() {
      return dispatch(
        fetchIssue({ id })
      );
    },

    fetchIssueComments() {
      return dispatch(
        fetchIssueComments({ issueID: id })
      );
    },

    markIssueSeen() {
      return dispatch(
        markIssueSeen({
          id,
          includeComments: true,
        })
      );
    },
  };
};

export const IssueDetailContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(InnerIssueDetailContainer);
