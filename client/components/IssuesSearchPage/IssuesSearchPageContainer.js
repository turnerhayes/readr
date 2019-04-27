import React from "react";
import PropTypes from "prop-types";
import ImmutablePropTypes from "react-immutable-proptypes";
import { connect } from "react-redux";
import { push } from "connected-react-router/immutable";
import Typography from "@material-ui/core/Typography";
import qs from "qs";

import { IssuesSearchPage } from "./IssuesSearchPage";
import { searchIssues, clearIssuesSearchResults } from "+app/actions";
import { ISSUE_STATUSES } from "+app/constants";
import { fromJS } from "immutable";

/**
 * Issue search page container that triggers a search if results have not been
 * fetched.
 */
class InnerIssuesSearchPageContainer extends React.PureComponent {
  static propTypes = {
    results: ImmutablePropTypes.iterableOf(
      ImmutablePropTypes.map
    ),
    query: PropTypes.string,
    selectedActivityBy: PropTypes.arrayOf(
      PropTypes.object
    ),
    selectedStatuses: PropTypes.arrayOf(
      PropTypes.oneOf(
        ISSUE_STATUSES
      )
    ),
    runSearch: PropTypes.func.isRequired,
  }

  /**
   * Renders the component.
   *
   * @return {JSX.Element}
   */
  render() {
    if (
      this.props.query ||
      (
        this.props.selectedActivityBy &&
        this.props.selectedActivityBy.length > 0
      ) ||
      (
        this.props.selectedStatuses &&
        this.props.selectedStatuses.length > 0
      )
    ) {
      if (this.props.results && this.props.results.isEmpty()) {
        return (
          <Typography
            variant="body2"
          >
            No results
          </Typography>
        );
      }

      if (this.props.results === null) {
        // Need to do this outside the render function because otherwise,
        // for some reason, it tries to trigger a state change during the
        // render (rather than scheduling the resulting change for the next
        // loop)
        if (!this._searchTimeout) {
          this._searchTimeout = setTimeout(
            () => {
              this.props.runSearch({
                query: this.props.query,
                selectedStatuses: this.props.selectedStatuses,
                selectedActivityBy: this.props.selectedActivityBy,
              });

              this._searchTimeout = undefined;
            },
            0
          );
        }

        return (
          <Typography
            variant="body2"
          >
            Searching...
          </Typography>
        );
      }
    }

    return (
      <IssuesSearchPage
        {...this.props}
      />
    );
  }
}

const mapStateToProps = (state) => {
  const resultIDs = state.issues.get("searchResults");

  let results = null;

  if (resultIDs) {
    results = state.issues.get("items").filter(
      (item) => resultIDs.includes(item.get("id"))
    );
  }

  const {
    q: query,
    s: selectedStatuses,
    a: selectedActivityBy,
  } = qs.parse(
    state.router.getIn([
      "location",
      "search",
    ], ""),
    {
      ignoreQueryPrefix: true,
      allowDots: true,
    }
  ) || {};

  return {
    results,
    query,
    selectedStatuses,
    selectedActivityBy: selectedActivityBy &&
      selectedActivityBy.map((user) => fromJS(user)),
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const { location } = ownProps;

  return {
    changeSearch({
      query: q,
      selectedStatuses: s,
      selectedActivityBy: a,
    }) {
      dispatch(
        clearIssuesSearchResults()
      );

      dispatch(
        push(`${location.pathname}${
          qs.stringify(
            {
              q,
              s,
              a,
            },
            {
              addQueryPrefix: true,
              arrayFormat: "indices",
              allowDots: true,
            }
          )
        }`)
      );
    },

    runSearch({
      query,
      selectedStatuses,
      selectedActivityBy,
    }) {
      dispatch(
        searchIssues({
          searchQuery: query,
          statuses: selectedStatuses,
          activityBy: selectedActivityBy,
        })
      );
    },
  };
};

const IssuesSearchPageContainer = connect(
  mapStateToProps,
  mapDispatchToProps
// )(IssuesSearchPage);
)(InnerIssuesSearchPageContainer);

export { IssuesSearchPageContainer };
