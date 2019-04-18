import React from "react";
import PropTypes from "prop-types";
import ImmutablePropTypes from "react-immutable-proptypes";

export const IssueUserDisplayName = ({
  issue,
  component: Component = "span",
  useCreated = false,
  ...props
}) => {
  let displayName = issue.get(useCreated ? "createdByText" : "updatedByText");

  if (!displayName) {
    displayName = issue.getIn(
      [
        useCreated ?
          "createdBy" :
          "updatedBy",
        "name",
        "display",
      ]
    );
  }

  if (Component === null) {
    return displayName;
  }

  return (
    <Component
      {...props}
    >
      {displayName}
    </Component>
  );
};

IssueUserDisplayName.propTypes = {
  issue: ImmutablePropTypes.map,
  useCreated: PropTypes.bool,
  component: PropTypes.oneOf([
    null,
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.elementType,
    ]),
  ]),
};
