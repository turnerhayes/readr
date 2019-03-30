import { connect } from "react-redux";

import {
  addRentDates,
} from "+app/actions";
import { AddRentDatesForm } from "./AddRentDatesForm";

export const AddRentDatesFormContainer = connect(
  (state) => ({
    isAPICallRunning: state.api.getIn(
      [
        "calls",
        "addRentDates",
      ],
      false,
    ),
  }),
  (dispatch) => ({
    addRentDates({
      numDates,
      dueAmountPerDate,
      firstRentDate,
      rentPeriod,
    }) {
      dispatch(
        addRentDates({
          numDates,
          dueAmountPerDate,
          firstRentDate,
          rentPeriod,
        })
      );
    },
  })
)(AddRentDatesForm);

