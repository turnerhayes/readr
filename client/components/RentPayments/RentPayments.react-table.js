import React from "react";
import PropTypes from "prop-types";
import ImmutablePropTypes from "react-immutable-proptypes";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ReactTable from "react-table";
import { format } from "date-fns";

import "react-table/react-table.css";


const DATE_DISPLAY_FORMAT_STRING = "MM/DD/YYYY";

const DateCellFormatter = (props) => props.value ?
  format(
    props.value,
    DATE_DISPLAY_FORMAT_STRING
  ) :
  null;

const DollarCellFormatter = (props) => props.value === undefined ?
  null : "$" + (
    props.value / 100
  ).toFixed(2);


const styles = {
  table: {},

  cell: {
    width: "25%",
  },
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
        Header: "Date Due",
        accessor: "dueDate",
        Cell: DateCellFormatter,
      },
      {
        Header: "Amount Due",
        accessor: "dueAmount",
        Cell: DollarCellFormatter,
      },
      {
        Header: "Date Paid",
        accessor: "paidDate",
        Cell: DateCellFormatter,
      },
      {
        Header: "Amount Paid",
        accessor: "paidAmount",
        Cell: DollarCellFormatter,
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
        <ReactTable
          data={rows}
          columns={columns}
        />
      </div>
    );
  }
}

const StyledRentPayments = withStyles(styles)(RentPayments);

export { StyledRentPayments as RentPayments };
