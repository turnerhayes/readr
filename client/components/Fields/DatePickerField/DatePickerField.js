import React from "react";
import PropTypes from "prop-types";
import { DatePicker } from "material-ui-pickers";

import { DATE_DISPLAY_FORMAT } from "+app/constants";

export const DatePickerField = ({ field, form, ...otherProps }) => (
  <DatePicker
    format={DATE_DISPLAY_FORMAT}
    mask={(value) => value ?
      [
        /\d/,
        /\d/,
        "/",
        /\d/,
        /\d/,
        "/",
        /\d/,
        /\d/,
        /\d/,
        /\d/,
      ] :
      []
    }
    keyboard
    autoOk
    error={
      Boolean(
        form.errors[field.name] &&
        form.touched[field.name]
      )
    }
    helperText={
      form.touched[field.name] ?
        form.errors[field.name] :
        ""
    }
    {...field}
    onError={
      (_, error) => {
        form.setFieldError(field.name, error);
      }
    }
    onChange={(value) => {
      form.setFieldValue(field.name, value);
    }}
    {...otherProps}
  />
);

DatePickerField.propTypes = {
  field: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
  form: PropTypes.shape({
    errors: PropTypes.object.isRequired,
    touched: PropTypes.object.isRequired,
    setFieldError: PropTypes.func.isRequired,
    setFieldValue: PropTypes.func.isRequired,
  }).isRequired,
};
