import { Map } from "immutable";
import {
  FETCH_ADD_RENT_PAYMENT_START,
  FETCH_ADD_RENT_PAYMENT_COMPLETE,
  FETCH_ADD_RENT_PAYMENT_FAIL,
  FETCH_GET_RENT_PAYMENTS_START,
  FETCH_GET_RENT_PAYMENTS_FAIL,
  FETCH_GET_RENT_PAYMENTS_COMPLETE,
} from "+app/actions";

export const APIReducer = (state = Map(), action) => {
  switch (action.type) {
    case FETCH_ADD_RENT_PAYMENT_START: {
      return state.setIn(
        [
          "calls",
          "addRentPayment",
        ],
        true
      );
    }

    case FETCH_ADD_RENT_PAYMENT_FAIL:
    case FETCH_ADD_RENT_PAYMENT_COMPLETE: {
      return state.deleteIn(
        [
          "calls",
          "addRentPayment",
        ]
      );
    }

    case FETCH_GET_RENT_PAYMENTS_START: {
      return state.setIn(
        [
          "calls",
          "getRentPayments",
        ],
        true
      );
    }

    case FETCH_GET_RENT_PAYMENTS_FAIL:
    case FETCH_GET_RENT_PAYMENTS_COMPLETE: {
      return state.deleteIn(
        [
          "calls",
          "getRentPayments",
        ]
      );
    }

    default: {
      return state;
    }
  }
};
