import React from "react";
import PropTypes from "prop-types";
import ImmutablePropTypes from "react-immutable-proptypes";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ReactDataGrid from "react-data-grid";
import { format } from "date-fns";

import { NumberOrEmptyStringPropType } from "./PropTypes";
import { DefaultingDateEditor } from "./DataGridEditors/DateEditor";
import { DollarEditor } from "./DataGridEditors/DollarEditor";

const DATE_DISPLAY_FORMAT_STRING = "MM/DD/YYYY";


const styles = {
  table: {},

  cell: {
    width: "25%",
  },
};

/**
 * Component to format date values in the grid
 *
 * @param {object} props
 * @param {string} props.value the value of the cell
 *
 * @return {React.ReactElement|null} the formatted cell content
 */
function DateFormatter({ value }) {
  return value === "" || value === null ?
    null :
    (
      <span>
        {format(Number(value), DATE_DISPLAY_FORMAT_STRING)}
      </span>
    );
}

DateFormatter.propTypes = {
  value: NumberOrEmptyStringPropType,
};

/**
 * Component to format dollar values in the grid.
 *
 * @param {object} props
 * @param {string} props.value the value of the cell
 *
 * @return {React.ReactElement|null} the formatted cell content
 */
function DollarFormatter({ value }) {
  return value === "" ?
    null : (
      <span>
        ${(value / 100).toFixed(2)}
      </span>
    );
}

DollarFormatter.propTypes = {
  value: NumberOrEmptyStringPropType.isRequired,
};

/**
 * Rent payments table component
 */
class RentPayments extends React.PureComponent {
  /**
   * @property {object} props
   *
   * @param {object} props.payments data about the payments
   * @param {number|null} props.editingPaidDate the due date for the row
   * whose Paid Date cell is being edited (if any)
   * @param {number|null} props.editingPaidAmount the due date for the row
   * whose Paid Amount cell is being edited (if any)
   * @param {function} props.setEditingPaidDate callback to set what row has
   * its Paid Date column being edited (if any)
   * @param {function} props.setEditingPaidAmount callback to set what row has
   * its Paid Amount column being edited (if any)
   * @param {function} props.setPaidDate callback to set the value of a Paid
   * Date column
   * @param {function} props.setPaidAmount callback to set the value of a Paid
   * Amount column
   */

  static propTypes = {
    classes: PropTypes.shape({
      table: PropTypes.string,
      cell: PropTypes.string,
    }).isRequired,
    payments: ImmutablePropTypes.mapOf(
      ImmutablePropTypes.contains({
        paidDate: PropTypes.oneOfType([
          PropTypes.number,
          PropTypes.instanceOf(Date),
        ]).isRequired,
        paidAmount: PropTypes.number.isRequired,
      }),
      PropTypes.number
    ).isRequired,
    setPaidDate: PropTypes.func.isRequired,
    setPaidAmount: PropTypes.func.isRequired,
  }

  /**
   * Handles the onGridRowsUpdated event of the data grid
   *
   * @param {...object} changes an array of the changes made to the row
   */
  handleGridRowsUpdated = (...changes) => {
    for (const change of changes) {
      if (change.cellKey === "paidAmount") {
        this.props.setPaidAmount({
          dueDate: change.fromRowId,
          // convert to cents
          paidAmount: change.updated * 100,
        });
      } else if (change.cellKey === "paidDate") {
        this.props.setPaidDate({
          dueDate: change.fromRowId,
          paidDate: change.updated ?
            change.updated.getTime() :
            null,
        });
      }
    }
  }

  /**
   * Renders the component.
   *
   * @return {React.ReactElement} the component
   */
  render() {
    const {
      payments,
    } = this.props;

    const columns = [
      {
        key: "dueDate",
        name: "Date Due",
        formatter: DateFormatter,
        frozen: true,
        width: 90,
      },
      {
        key: "dueAmount",
        name: "Amount Due",
        formatter: DollarFormatter,
      },
      {
        key: "paidDate",
        name: "Date Paid",
        formatter: DateFormatter,
        editor: DefaultingDateEditor,
      },
      {
        key: "paidAmount",
        name: "Amount Paid",
        formatter: DollarFormatter,
        editor: DollarEditor,
      },
    ];

    const rows = payments.reduce(
      (rows, paymentData, dueDate) => {
        rows.push({
          id: dueDate,
          dueDate: dueDate,
          dueAmount: paymentData.get("dueAmount"),
          paidDate: paymentData.get("paidDate"),
          paidAmount: paymentData.get("paidAmount"),
        });

        return rows;
      },
      []
    );

    return (
      <div>
        <Typography
          variant="h2"
          align="center"
        >
          Rent Payments
        </Typography>
        <ReactDataGrid
          columns={columns}
          rowsCount={rows.length}
          rowGetter={(i) => rows[i]}
          minHeight={200}
          enableCellSelect
          onGridRowsUpdated={this.handleGridRowsUpdated}
        />
      </div>
    );
  }
}

const StyledRentPayments = withStyles(styles)(RentPayments);

export { StyledRentPayments as RentPayments };
