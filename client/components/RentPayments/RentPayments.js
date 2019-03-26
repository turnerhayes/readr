import React from "react";
import PropTypes from "prop-types";
import ImmutablePropTypes from "react-immutable-proptypes";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { format } from "date-fns";

import "primereact/resources/themes/nova-light/theme.css";
import "primereact/resources/primereact.min.css";

const CurrencyFormatter = new Intl.NumberFormat(
  navigator.languages,
  {
    style: "currency",
    currency: "USD",
  }
);

const DateFormatter = new Intl.DateTimeFormat(
  navigator.languages,
  {
    timeZone: "UTC",
  }
);

const DollarCellFormatter = (rowData, columnSettings) => {
  return rowData[columnSettings.field] === null ?
    null :
    CurrencyFormatter.format(rowData[columnSettings.field] / 100);
};

const DateCellFormatter = (rowData, columnSettings) => {
  return rowData[columnSettings.field] === null ?
    null :
    DateFormatter.format(new Date(rowData[columnSettings.field]));
};

const styles = {
  lateRow: {
    // This boosts the specificity of the generated selector
    // (e.g. `.lateRow.lateRow.lateRow.lateRow`). This is to beat
    // the specificity of a selector in the PrimeReact theme CSS.
    "&&&&": {
      backgroundColor: "red",
      color: "white",
    },
  },

  incompletePayment: {
    "&&&&": {
      backgroundColor: "pink",
    },
  },
};

/**
 * Rent payments table component
 */
class RentPayments extends React.PureComponent {
  /**
   * @property {object} props
   *
   * @param {object} props.classes class names for styling
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
    classes: PropTypes.object.isRequired,
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

  filterIconRef = React.createRef()

  /**
   * Handles the change event of a Paid Date column cell
   *
   * @param {event} event the blur event
   */
  handlePaidDateBlur = (event) => {
    const value = event.target.value === "" ?
      null :
      event.target.value;

    const dueDate = event.target.dataset.dueDate;

    const currentValue = this.props.payments.getIn(
      [
        dueDate,
        "paidDate",
      ]
    );

    if (value !== currentValue) {
      this.props.setPaidDate({
        dueDate,
        paidDate: value,
      });
    }
  }

  /**
   * Handles the keyup event of a Paid Date column cell
   *
   * @param {event} event the keyup event
   */
  handlePaidDateKeyDown = (event) => {
    const dueDate = event.target.dataset.dueDate;

    if (event.key === "Enter") {
      this.handlePaidDateBlur(event);
    } else if (event.key === "t") {
      this.props.setPaidDate({
        dueDate,
        paidDate: format(
          new Date(),
          "YYYY-MM-DD",
        ),
      });
    } else if (event.key === "d") {
      this.props.setPaidDate({
        dueDate,
        paidDate: dueDate,
      });
    }
  }

  /**
   * Creates an editor component for the Paid Date cell
   *
   * @param {object} props
   * @param {object} props.rowData the data of the row for the cell being
   * edited
   * @param {string} props.field the name of the field for the cell being
   * edited
   *
   * @return {React.ReactElement}
   */
  paidDateEditor = ({ rowData, field }) => {
    return (
      <TextField
        type="date"
        defaultValue={rowData[field]}
        onBlur={this.handlePaidDateBlur}
        onKeyDown={this.handlePaidDateKeyDown}
        inputProps={{
          "data-due-date": rowData.dueDate,
        }}
      />
    );
  };

  /**
   * Handles the blur event of a Paid Amount column cell
   *
   * @param {event} event the blur event
   */
  handlePaidAmountBlur = (event) => {
    let value = event.target.value === "" ?
      null :
      event.target.valueAsNumber;

    if (!Number.isNaN(value)) {
      const dueDate = event.target.dataset.dueDate;

      if (value !== null) {
        // convert to cents
        value = value * 100;
      }

      const currentValue = this.props.payments.getIn(
        [
          dueDate,
          "paidAmount",
        ]
      );

      if (value !== currentValue) {
        this.props.setPaidAmount({
          dueDate,
          paidAmount: value,
        });
      }
    }
  }

  /**
   * Handles the keyup event of a Paid Amount column cell
   *
   * @param {event} event the keyup event
   */
  handlePaidAmountKeyDown = (event) => {
    if (event.key === "Enter") {
      this.handlePaidAmountBlur(event);
    }
  }

  /**
   * Creates an editor component for the Paid Amount cell
   *
   * @param {object} props
   * @param {object} props.rowData the data of the row for the cell being
   * edited
   * @param {string} props.field the name of the field for the cell being
   * edited
   *
   * @return {React.ReactElement}
   */
  paidAmountEditor = ({ rowData, field }) => {
    let currentValue = rowData[field];

    if (currentValue) {
      currentValue = (currentValue / 100).toFixed(2);
    }

    return (
      <TextField
        type="number"
        defaultValue={currentValue}
        onBlur={this.handlePaidAmountBlur}
        onKeyDown={this.handlePaidAmountKeyDown}
        inputProps={{
          "data-due-date": rowData.dueDate,
          "step": 0.01,
          "min": 0,
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment
              position="start"
            >
              $
            </InputAdornment>
          ),
        }}
      />
    );
  }

  /**
   * Gets classes for a row.
   *
   * @param {object} rowData the data for the row
   *
   * @return {object} a map of class names to booleans
   */
  getRowClasses = (rowData) => {
    const dueDate = rowData.dueDate;

    return {
      [this.props.classes.lateRow]: new Date(dueDate) < new Date() &&
        rowData.paidAmount !== rowData.dueAmount,
      [this.props.classes.incompletePayment]: rowData.discrepancy > 0,
    };
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

    const rows = [];

    const mismatchedPaymentDueDates = [];

    payments.forEach(
      (paymentData, dueDate) => {
        const totalPayment = paymentData.get("totalPayment");
        const dueAmount = paymentData.get("dueAmount");

        let discrepancy = null;

        if (totalPayment !== null && totalPayment !== dueAmount) {
          mismatchedPaymentDueDates.push(dueDate);

          discrepancy = dueAmount - totalPayment;
        }

        const row = {
          id: dueDate,
          dueDate: dueDate,
          dueAmount,
          paidDate: paymentData.get("paidDate"),
          totalPayment,
          discrepancy,
        };

        rows.push(row);
      }
    );

    const columns = [
      (
        <Column
          key="dueDate"
          field="dueDate"
          header="Date Due"
          frozen
          body={DateCellFormatter}
        />
      ),
      (
        <Column
          key="dueAmount"
          field="dueAmount"
          header="Amount Due"
          body={DollarCellFormatter}
        />
      ),
      (
        <Column
          key="paidDate"
          field="paidDate"
          header="Date Paid"
          editor={this.paidDateEditor}
          // body={DateCellFormatter}
        />
      ),
      (
        <Column
          key="totalPayment"
          field="totalPayment"
          header="Amount Paid"
          editor={this.paidAmountEditor}
          editorValidator={({ rowData, field }) => {
            const value = rowData[field];

            return Math.floor(value * 100) === value * 100;
          }}
          body={DollarCellFormatter}
        />
      ),
    ];

    return (
      <div>
        <Typography
          variant="h2"
          align="center"
        >
          Rent Payments
        </Typography>
        <DataTable
          value={rows}
          rowClassName={this.getRowClasses}
          ref={this.dataTableRef}
        >
          {columns}
        </DataTable>
      </div>
    );
  }
}

const StyledRentPayments = withStyles(styles)(RentPayments);

export { StyledRentPayments as RentPayments };
