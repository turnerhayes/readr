import React from "react";
import PropTypes from "prop-types";
import NumberFormat from "react-number-format";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";

/**
 * Formatted number field component
 *
 * @param {object} props
 *
 * @return {JSX.Element}
 */
function FormattedNumberField(props) {
  const {
    inputRef,
    onChange,
    ...other
  } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={({ value }) => {
        onChange(value);
      }}
      thousandSeparator
      decimalScale={2}
    />
  );
}

FormattedNumberField.propTypes = {
  inputRef: PropTypes.func,
  onChange: PropTypes.func,
  name: PropTypes.string,
};

/**
 * Currency field input component
 *
 * @param {object} props
 *
 * @return {JSX.Element}
 */
export const CurrencyField = (props) => {
  const {
    field,
    form,
    inputProps,
    InputProps,
    ...otherProps
  } = props;

  const errorText = form.errors[field.name];

  return (
    <TextField
      autoComplete="off"
      error={Boolean(errorText && form.touched[field.name])}
      helperText={
        form.touched[field.name] ?
          errorText :
          ""
      }
      inputProps={{
        step: 0.01,
        min: 0,
        ...inputProps,
      }}
      InputProps={{
        inputComponent: FormattedNumberField,
        startAdornment: (
          <InputAdornment
            position="start"
          >$</InputAdornment>
        ),
        ...InputProps,
      }}
      {...field}
      onChange={(value) => form.setFieldValue(field.name, value)}
      onError={
        (_, error) => {
          form.setFieldError(field.name, error);
        }
      }
      {...otherProps}
    />
  );
};

CurrencyField.propTypes = {
  form: PropTypes.shape({
    errors: PropTypes.object.isRequired,
    touched: PropTypes.object.isRequired,
    setFieldValue: PropTypes.func.isRequired,
  }).isRequired,
  field: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
  inputProps: PropTypes.object,
  InputProps: PropTypes.object,
};

