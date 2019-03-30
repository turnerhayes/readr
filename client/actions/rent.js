import * as api from "+app/api";

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

export const FETCH_GET_RENT_PAYMENTS_START = "FETCH_GET_RENT_PAYMENTS_START";

export const FETCH_GET_RENT_PAYMENTS_FAIL = "FETCH_GET_RENT_PAYMENTS_FAIL";

// eslint-disable-next-line max-len
export const FETCH_GET_RENT_PAYMENTS_COMPLETE = "FETCH_GET_RENT_PAYMENTS_COMPLETE";

/**
 * Action creator for fetching rent payments
 *
 * @return {function} an action creator function
 */
export function fetchRentPayments() {
  return async (dispatch) => {
    try {
      dispatch({
        type: FETCH_GET_RENT_PAYMENTS_START,
        payload: {},
        api: {
          callName: "fetchRentPayments",
          status: "started",
        },
      });

      const rentPayments = await api.getRentPayments();

      dispatch({
        type: FETCH_GET_RENT_PAYMENTS_COMPLETE,
        payload: {
          rentPayments: rentPayments,
        },
        api: {
          callName: "fetchRentPayments",
          status: "complete",
        },
      });
    } catch (ex) {
      dispatch({
        type: FETCH_GET_RENT_PAYMENTS_FAIL,
        api: {
          callName: "fetchRentPayments",
          status: "complete",
        },
        error: ex,
      });
    }
  };
}

export const FETCH_ADD_RENT_PAYMENT_START = "FETCH_ADD_RENT_PAYMENT_START";

export const FETCH_ADD_RENT_PAYMENT_FAIL = "FETCH_ADD_RENT_PAYMENT_FAIL";

// eslint-disable-next-line max-len
export const FETCH_ADD_RENT_PAYMENT_COMPLETE = "FETCH_ADD_RENT_PAYMENT_COMPLETE";

/**
 * Action creator for the add rent payment action
 *
 * @param {object} args
 * @param {string} args.dueDate the rent date to which this payment applies,
 * as an ISO date string
 * @param {string} args.paidDate the date on which this payment was made,
 * as an ISO date string
 * @param {number} args.paidAmount the amount of the payment, as a number of
 * cents
 *
 * @return {function} an action creator function
 */
export const addRentPayment = ({ dueDate, paidDate, paidAmount }) => {
  if (!dueDate) {
    throw new Error(
      "addRentPayment action creator requires a `dueDate` parameter"
    );
  }

  if (!paidDate) {
    throw new Error(
      "addRentPayment action creator requires a `paidDate` parameter"
    );
  }

  if (!paidAmount) {
    throw new Error(
      "addRentPayment action creator requires a `paidAmount` parameter"
    );
  }

  return async (dispatch) => {
    try {
      dispatch({
        type: FETCH_ADD_RENT_PAYMENT_START,
        payload: {
          dueDate,
          paidDate,
          paidAmount,
        },
        api: {
          callName: "addRentPayment",
          status: "started",
        },
      });

      await api.addRentPayment({
        paidAmount,
        paidDate,
        dueDate,
      });

      dispatch(
        fetchRentPayments()
      );

      dispatch({
        type: FETCH_ADD_RENT_PAYMENT_COMPLETE,
        payload: {
          dueDate,
          paidDate,
          paidAmount,
        },
        api: {
          callName: "addRentPayment",
          status: "complete",
        },
      });
    } catch (ex) {
      dispatch({
        type: FETCH_ADD_RENT_PAYMENT_FAIL,
        payload: {
          dueDate,
          paidDate,
          paidAmount,
        },
        api: {
          callName: "addRentPayment",
          status: "complete",
        },
        error: ex,
      });
    }
  };
};

export const FETCH_ADD_RENT_DATES_START = "FETCH_ADD_RENT_DATES_START";

export const FETCH_ADD_RENT_DATES_FAIL = "FETCH_ADD_RENT_DATES_FAIL";

// eslint-disable-next-line max-len
export const FETCH_ADD_RENT_DATES_COMPLETE = "FETCH_ADD_RENT_DATES_COMPLETE";

/**
 * Creates an action for ADD_RENT_DATES
 *
 * @return {object}
 */
export const addRentDates = ({
  numDates,
  firstRentDate,
  rentPeriod,
  dueAmountPerDate,
}) => {
  if (!numDates) {
    throw new Error(
      "addRentDates action creator requires a `numDates` parameter"
    );
  } else if (numDates > 1 && !rentPeriod) {
    throw new Error(
      // eslint-disable-next-line max-len
      "addRentDates action creator requires a `rentPeriod` parameter if `numDates` is greater than 1"
    );
  }

  if (!firstRentDate) {
    throw new Error(
      "addRentDates action creator requires a `firstRentDate` parameter"
    );
  }

  if (!dueAmountPerDate) {
    throw new Error(
      "addRentDates action creator requires a `dueAmountPerDate` parameter"
    );
  }

  return async (dispatch) => {
    try {
      dispatch({
        type: FETCH_ADD_RENT_DATES_START,
        payload: {
          numDates,
          firstRentDate,
          rentPeriod,
          dueAmountPerDate,
        },
        api: {
          callName: "addRentDates",
          status: "started",
        },
      });

      await api.addRentDates({
        numDates,
        firstRentDate,
        rentPeriod,
        dueAmountPerDate,
      });

      dispatch(
        fetchRentPayments()
      );

      dispatch({
        type: FETCH_ADD_RENT_DATES_COMPLETE,
        payload: {
          numDates,
          firstRentDate,
          rentPeriod,
          dueAmountPerDate,
        },
        api: {
          callName: "addRentDates",
          status: "complete",
        },
      });
    } catch (ex) {
      dispatch({
        type: FETCH_ADD_RENT_DATES_FAIL,
        payload: {
          numDates,
          firstRentDate,
          rentPeriod,
          dueAmountPerDate,
        },
        api: {
          callName: "addRentDates",
          status: "complete",
        },
        error: ex,
      });
    }
  };
};

