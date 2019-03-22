import { Map, OrderedMap } from "immutable";
import { format } from "date-fns";

import {
  SET_RENT_PAID_DATE,
  SET_RENT_PAID_AMOUNT,
} from "+app/actions";

const startDate = new Date();

const MONTHLY_RENT = 2500e2;

const paymentMap = OrderedMap().withMutations(
  (map) => {
    for (let monthOffset = 0; monthOffset < 12; monthOffset++) {
      const date = new Date(startDate);
      date.setMonth(date.getMonth() + monthOffset);
      date.setDate(1);

      const dateString = format(
        date,
        "YYYY-MM-DD"
      );

      map.set(
        dateString,
        Map({
          paidDate: null,
          paidAmount: null,
          dueAmount: MONTHLY_RENT,
        })
      );
    }
  }
);

const initialState = Map({
  payments: paymentMap,
});

/**
 * Rent reducer
 *
 * @param {Immutable.Map} state the initial state
 * @param {object} action the dispatched action
 *
 * @return {Immutable.Map} the transformed state
 */
export function rentReducer(state = initialState, action) {
  switch (action.type) {
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
