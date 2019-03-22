import React, { useCallback } from "react";
import { useMappedState, useDispatch } from "redux-react-hook";

import {
  setUIState,
  setRentPaidDate,
  setRentPaidAmount,
} from "+app/actions";
import { RentPayments } from "./RentPayments";
import { Map } from "immutable";

const UI_SECTION_NAME = "RentPayments";

export const RentPaymentsContainer = () => {
  const mapState = useCallback(
    (state) => {
      return {
        numMonths: state.rent.get("monthCount"),
        editingPaidDate: state.ui.getIn(
          [
            UI_SECTION_NAME,
            "editingPaidDate",
          ],
          null
        ),
        editingPaidAmount: state.ui.getIn(
          [
            UI_SECTION_NAME,
            "editingPaidAmount",
          ],
          null
        ),
        payments: state.rent.get(
          "payments",
          Map()
        ),
      };
    },
    []
  );

  const mappedState = useMappedState(mapState);

  const dispatch = useDispatch();

  const setEditingPaidAmount = useCallback(
    (date) => dispatch(setUIState({
      section: UI_SECTION_NAME,
      key: "editingPaidAmount",
      value: date,
    })),
    [dispatch]
  );

  const setEditingPaidDate = useCallback(
    (date) => dispatch(setUIState({
      section: UI_SECTION_NAME,
      key: "editingPaidDate",
      value: date,
    })),
    [dispatch]
  );

  const setPaidDate = useCallback(
    ({ dueDate, paidDate }) => {
      dispatch(setRentPaidDate({
        dueDate,
        paidDate,
      }));
    },
    [dispatch]
  );

  const setPaidAmount = useCallback(
    ({ dueDate, paidAmount }) => {
      dispatch(setRentPaidAmount({
        dueDate,
        paidAmount,
      }));
    },
    [dispatch]
  );

  return (
    <RentPayments
      {...mappedState}
      setEditingPaidAmount={setEditingPaidAmount}
      setEditingPaidDate={setEditingPaidDate}
      setPaidDate={setPaidDate}
      setPaidAmount={setPaidAmount}
    />
  );
};
