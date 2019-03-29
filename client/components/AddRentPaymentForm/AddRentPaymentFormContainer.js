import { connect } from "react-redux";
import format from "date-fns/format";
import {
  addRentPayment,
} from "+app/actions";

import { AddRentPaymentForm } from "./AddRentPaymentForm";

export const AddRentPaymentFormContainer = connect(
  (state) => {
    const dueDates = state.rent.get("payments").filter(
      (paymentData) => paymentData.get("totalPayments", 0) <
        paymentData.get("dueAmount")
    ).keySeq();

    const dueDate = dueDates.first();

    const dueAmount = state.rent.getIn(
      [
        "payments",
        dueDate,
        "dueAmount",
      ]
    );

    return {
      initialValues: {
        paidDate: format(new Date(), "yyyy-MM-dd"),
        dueDate,
        paidAmount: dueAmount === undefined ?
          "" :
          (dueAmount / 100).toFixed(2),
      },
      dueDates,
      isAPICallRunning: state.api.getIn(
        [
          "calls",
          "addRentPayment",
        ],
        false,
      ),
    };
  },
  (dispatch) => {
    return {
      addRentPayment({ dueDate, paidDate, paidAmount }) {
        dispatch(
          addRentPayment({
            dueDate,
            paidDate,
            paidAmount,
          })
        );
      },
    };
  }
)(AddRentPaymentForm);

