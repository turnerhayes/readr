import React from "react";
import PropTypes from "prop-types";
import ImmutablePropTypes from "react-immutable-proptypes";
import { is } from "immutable";
import { connect } from "react-redux";

import { fetchIssues, getNewIssues } from "+app/actions";
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
    newActivity: ImmutablePropTypes.map,
    getNewIssues: PropTypes.func.isRequired,
  }

  /**
   */
  componentDidMount() {
    this.props.fetchIssues();
  }

  /**
   * @param {object} prevProps the previous component prop values
   */
  componentDidUpdate(prevProps) {
    if (!is(prevProps.newActivity, this.props.newActivity)) {
      this.props.getNewIssues();
    }
  }

  /**
   * Renders the component.
   *
   * @return {JSX.Element}
   */
  render() {
    const {
      // eslint-disable-next-line no-unused-vars
      getNewIssues,
      ...props
    } = this.props;

    return (
      <IssuesGrid
        {...props}
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

  getNewIssues() {
    dispatch(
      getNewIssues()
    );
  },
});

export const IssuesGridContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(IssuesGridInnerContainer);
