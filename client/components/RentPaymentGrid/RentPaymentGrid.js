import React from "react";
import PropTypes from "prop-types";
import ImmutablePropTypes from "react-immutable-proptypes";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { withStyles } from "@material-ui/core/styles";

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

  paidAmountHeader: {
    display: "flex",
    alignItems: "center",
  },

  addRentPaymentButton: {
    marginLeft: "auto",
  },
};

/**
 * Rent payment grid component
 */
class RentPaymentGrid extends React.PureComponent {
  /**
   * @property {object} props
   *
   * @param {object} props.classes class names for styling
   * @param {object} props.payments data about the payments
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

    const {
      lateRow,
    } = this.props.classes;

    return {
      [lateRow]: new Date(dueDate) < new Date() &&
        rowData.totalPayment < rowData.dueAmount,
    };
  }

  /**
   * Renders the component.
   *
   * @return {JSX.Element} the component
   */
  render() {
    const {
      payments,
    } = this.props;

    const rows = [];

    payments.forEach(
      (paymentData, dueDate) => {
        const totalPayment = paymentData.get("totalPayment");
        const dueAmount = paymentData.get("dueAmount");

        const row = {
          id: dueDate,
          dueDate: dueDate,
          dueAmount,
          totalPayment,
        };

        rows.push(row);
      }
    );

    return (
      <DataTable
        value={rows}
        rowClassName={this.getRowClasses}
        ref={this.dataTableRef}
      >
        <Column
          key="dueDate"
          field="dueDate"
          header="Date Due"
          frozen
          body={DateCellFormatter}
        />
        <Column
          key="dueAmount"
          field="dueAmount"
          header="Amount Due"
          body={DollarCellFormatter}
        />
        <Column
          key="totalPayment"
          field="totalPayment"
          header="Amount Paid"
          body={DollarCellFormatter}
        />
      </DataTable>
    );
  }
}

const StyledRentPaymentGrid = withStyles(styles)(RentPaymentGrid);

export { StyledRentPaymentGrid as RentPaymentGrid };

