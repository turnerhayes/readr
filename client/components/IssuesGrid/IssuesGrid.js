import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const ISSUES = [
  {
    id: 1,
    description: "Test Issue 1",
    status: "Open",
    priority: 4,
  },
  {
    id: 2,
    description: "Test Issue 2",
    status: "Open",
    priority: 1,
  },
];

const ViewIssueLink = ({ id }) => (
  <Link
    to={`/issues/${id}`}
  >
    View
  </Link>
);

ViewIssueLink.propTypes = {
  id: PropTypes.number.isRequired,
};

const sortByPriority = ({ order }) => {
  return ISSUES.slice().sort(
    (a, b) => {
      return (b.priority - a.priority) * order;
    }
  );
};

const styles = {
  idColumn: {
    width: "3em",
  },

  viewLinkColumn: {
    width: "4em",
  },

  flipped: {
    transform: "rotateX(180deg)",
  },
};

/**
 * Issues grid component
 */
class IssuesGrid extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  }

  state = {
    sortField: null,
    sortOrder: null,
  }

  /**
   * Handles the sort event
   *
   * @param {object} args
   * @param {string|null} sortField the name of the field being sorted
   * @param {-1|1} sortOrder the order of the sort (-1 for descending,
   * 1 for ascending)
   */
  handleSort = ({ sortField, sortOrder }) => {
    this.setState({
      sortField,
      sortOrder,
    });
  }

  /**
   * Adds a sort indicator to header content if applicable
   *
   * @param {*} content the header content
   * @param {string} field the name of the sorted field
   *
   * @return {JSX.Element}
   */
  addSortIndicator = (content, field) => {
    if (this.state.sortField === field) {
      return (
        <React.Fragment>
          {content}
          <span>
            <Icon
              title={`Sorted in ${
                this.state.sortOrder > 0 ?
                  "descending" :
                  "ascending"
              } order`}
            >
              {
                this.state.sortOrder > 0 ?
                  "\u21A7" :
                  "\u21A5"
              }
            </Icon>
          </span>
        </React.Fragment>
      );
    }

    return content;
  }

  /**
   * Renders the component
   *
   * @return {JSX.Element}
   */
  render() {
    return (
      <DataTable
        emptyMessage="No issues"
        value={ISSUES}
        sortField={this.state.sortField}
        sortOrder={this.state.sortOrder}
        onSort={this.handleSort}
      >
        <Column
          field="id"
          header="ID"
          className={this.props.classes.idColumn}
          style={{ width: "3em" }}
        />
        <Column
          field="priority"
          header={this.addSortIndicator("Priority", "priority")}
          sortable
          sortFunction={sortByPriority}
        />
        <Column
          field="description"
          header="Description"
          filter
          filterMatchMode="contains"
        />
        <Column
          field="status"
          header={this.addSortIndicator("Status", "status")}
          sortable
        />
        <Column
          columnKey="viewIssueLink"
          header="Link"
          body={ViewIssueLink}
          className={this.props.classes.viewLinkColumn}
        />
      </DataTable>
    );
  }
}

const StyledIssuesGrid = withStyles(styles)(IssuesGrid);

export { StyledIssuesGrid as IssuesGrid };

