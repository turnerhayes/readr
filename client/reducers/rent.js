import { Map } from "immutable";

import {
  SET_RENT_PAID_DATE,
  SET_RENT_PAID_AMOUNT,
  FETCH_GET_RENT_PAYMENTS_COMPLETE,
  FETCH_ADD_RENT_PAYMENT_COMPLETE,
} from "+app/actions";

const updatePayments = (state, action) => {
  const { rentPayments } = action.payload;

  return state.set(
    "payments",
    rentPayments
  );
};

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
    case FETCH_ADD_RENT_PAYMENT_COMPLETE: {
      return updatePayments(state, action);
    }
    case FETCH_GET_RENT_PAYMENTS_COMPLETE: {
      return updatePayments(state, action);
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
