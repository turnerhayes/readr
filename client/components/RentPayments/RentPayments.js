import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

const styles = {
  table: {
    borderCollapse: "collapse",
  },

  cell: {
    border: "1px solid black",
  },
};

class RentPayments extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  }

  render() {
    const {
      classes,
    } = this.props;

    return (
      <div>
        <header>
          Rent Payments
        </header>
        <table
          className={classes.table}
        >
          <thead>
            <tr>
              <th
                className={classes.cell}
              >Due Date</th>
              <th
                className={classes.cell}
              >Amount Due</th>
              <th
                className={classes.cell}
              >Payed Date</th>
              <th
                className={classes.cell}
              >Amount Payed</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                className={classes.cell}
              ></td>
              <td
                className={classes.cell}
              ></td>
              <td
                className={classes.cell}
              ></td>
              <td
                className={classes.cell}
              ></td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}


const StyledRentPayments = withStyles(styles)(RentPayments);

export { StyledRentPayments as RentPayments };
