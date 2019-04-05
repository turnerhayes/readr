import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";

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


const styles = {
  table: {
    borderCollapse: "collapse",
  },

  cell: {
    border: "1px solid black",
  },

  idColumn: {
    width: "3em",
  },

  viewLinkColumn: {
    width: "4em",
  },
};

const renderContent = (Content, row) => {
  return (
    <Content
      {...row}
    />
  );
};

/**
 * Issues grid component
 */
class IssuesGrid extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  }

  /**
   * Renders the component
   *
   * @return {JSX.Element}
   */
  render() {
    const columns = [
      {
        field: "id",
        header: "ID",
      },

      {
        field: "description",
        header: "Description",
      },

      {
        field: "status",
        header: "Status",
      },

      {
        header: "View",
        content: ({ id, description }) => (
          <Link
            to={`/issues/${id}`}
          >
            {description}
          </Link>
        ),
      },
    ];

    return (
      <table
        className={this.props.classes.table}
      >
        <thead>
          <tr>
            {
              columns.map(
                ({ header, field }) => (
                  <th
                    key={field || header}
                    className={this.props.classes.cell}
                  >
                    {header}
                  </th>
                )
              )
            }
          </tr>
        </thead>
        <tbody>
          {
            ISSUES.map(
              (row, index) => (
                <tr
                  key={index}
                >
                  {
                    columns.map(
                      ({ field, content }, index) => (
                        <td
                          key={index}
                          className={this.props.classes.cell}
                        >
                          {
                            content ?
                              renderContent(content, row) :
                              row[field]
                          }
                        </td>
                      )
                    )
                  }
                </tr>
              )
            )
          }
        </tbody>
      </table>
    );
  }
}

const StyledIssuesGrid = withStyles(styles)(IssuesGrid);

export { StyledIssuesGrid as IssuesGrid };

