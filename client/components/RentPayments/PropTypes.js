import PropTypes from "prop-types";

export const NumberOrEmptyStringPropType = PropTypes.oneOfType([
  PropTypes.number,
  PropTypes.oneOf([""]),
]);
