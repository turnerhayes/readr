import React, { useCallback } from "react";
import { useMappedState, useDispatch } from "redux-react-hook";

import {
  fetchRentPayments,
} from "+app/actions";
import { RentPaymentGrid } from "./RentPaymentGrid";


export const RentPaymentGridContainer = () => {
  const mapState = useCallback(
    (state) => {
      return {
        payments: state.rent.get(
          "payments"
        ),
      };
    },
    []
  );

  const mappedState = useMappedState(mapState);

  const dispatch = useDispatch();

  if (!mappedState.payments) {
    dispatch(fetchRentPayments());

    return null;
  }

  return (
    <RentPaymentGrid
      {...mappedState}
    />
  );
};
