export const SET_RENT_PAID_DATE = "SET_RENT_PAID_DATE";

/**
 * Creates a SET_RENT_PAID_DATE action.
 *
 * @param {object} args
 * @param {string} args.dueDate ISO date string of the payment due date
 * @param {string} args.paidDate ISO date string of the actual payment date
 *
 * @return {object}
 */
export function setRentPaidDate({ dueDate, paidDate }) {
  if (!dueDate) {
    throw new Error(
      "setRentPaidDate action creator requires a `dueDate` parameter"
    );
  }

  if (paidDate === undefined) {
    throw new Error(
      "setRentPaidDate action creator requires a `paidDate` parameter"
    );
  }

  return {
    type: SET_RENT_PAID_DATE,
    payload: {
      dueDate,
      paidDate,
    },
  };
}

export const SET_RENT_PAID_AMOUNT = "SET_RENT_PAID_AMOUNT";

/**
 * Creates a SET_RENT_PAID_AMOUNT action.
 *
 * @param {object} args
 * @param {number} args.dueDate timestamp of the payment due date
 * @param {number} args.paidAmount amount of the payment, in cents
 *
 * @return {object}
 */
export function setRentPaidAmount({ dueDate, paidAmount }) {
  if (!dueDate) {
    throw new Error(
      "setRentPaidAmount action creator requires a `dueDate` parameter"
    );
  }

  if (paidAmount === undefined) {
    throw new Error(
      "setRentPaidAmount action creator requires a `paidAmount` parameter"
    );
  }

  return {
    type: SET_RENT_PAID_AMOUNT,
    payload: {
      dueDate,
      paidAmount,
    },
  };
}
