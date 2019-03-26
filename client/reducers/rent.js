import { Map } from "immutable";

import {
  SET_RENT_PAID_DATE,
  SET_RENT_PAID_AMOUNT,
  FETCH_RENT_PAYMENTS_COMPLETE,
} from "+app/actions";


/**
 * Rent reducer
 *
 * @param {Immutable.Map} [state] the initial state
 * @param {object} action the dispatched action
 *
 * @return {Immutable.Map} the transformed state
 */
export function rentReducer(state = Map(), action) {
  switch (action.type) {
    case FETCH_RENT_PAYMENTS_COMPLETE: {
      const { rentPayments } = action.payload;

      return state.set(
        "payments",
        rentPayments
      );
    }

    case SET_RENT_PAID_DATE: {
      const { dueDate, paidDate } = action.payload;

      return state.setIn(
        [
          "payments",
          dueDate,
          "paidDate",
        ],
        paidDate
      );
    }
    case SET_RENT_PAID_AMOUNT: {
      const { dueDate, paidAmount } = action.payload;

      return state.setIn(
        [
          "payments",
          dueDate,
          "paidAmount",
        ],
        paidAmount
      );
    }
    default: {
      return state;
    }
  }
}
