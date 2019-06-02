import React, { useCallback } from "react";
import { useMappedState, useDispatch } from "redux-react-hook";
import { push } from "connected-react-router/immutable";
import hoistNonReactStatics from "hoist-non-react-statics";

import { isLoggedIn as isLoggedInSelector } from "+app/selectors/auth";

export const requireLogin = (Component) => {
  const RequiredLogin = (props) => {
    const mapState = useCallback(
      (state) => {
        return {
          isLoggedIn: isLoggedInSelector(state),
        };
      },
      []
    );

    const { isLoggedIn } = useMappedState(mapState);

    const dispatch = useDispatch();

    if (!isLoggedIn) {
      dispatch(
        push("/login")
      );

      return null;
    }

    return (
      <Component
        {...props}
      />
    );
  };

  RequiredLogin.displayName = `RequiredLogin(${
    Component.displayName || Component.name
  })`;

  RequiredLogin.requiresLogin = true;

  hoistNonReactStatics(RequiredLogin, Component);

  return RequiredLogin;
};

