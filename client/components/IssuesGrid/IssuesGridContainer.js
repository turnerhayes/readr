import React from "react";
import PropTypes from "prop-types";
import ImmutablePropTypes from "react-immutable-proptypes";
import { connect } from "react-redux";

import { fetchIssues } from "+app/actions";
import { newActivity } from "+app/selectors/viewActivity";

import { IssuesGrid } from "./IssuesGrid";

/**
 * Inner container that adds lifecycle event handlers
 */
class IssuesGridInnerContainer extends React.PureComponent {
  static propTypes = {
    issues: ImmutablePropTypes.mapOf(
      ImmutablePropTypes.map
    ),
    fetchIssues: PropTypes.func,
  }

  /**
   */
  componentDidMount() {
    this.props.fetchIssues();
  }

  /**
   * Renders the component.
   *
   * @return {JSX.Element}
   */
  render() {
    return (
      <IssuesGrid
        {...this.props}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  issues: state.issues.get("items") === null ?
    null :
    state.issues.get("items").filter(
      (issue) => issue.get("status") !== "closed"
    ),
  newActivity: newActivity(state),
});

const mapDispatchToProps = (dispatch) => ({
  fetchIssues() {
    dispatch(
      fetchIssues()
    );
  },
});

export const IssuesGridContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(IssuesGridInnerContainer);
