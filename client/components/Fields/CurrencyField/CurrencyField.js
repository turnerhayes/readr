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
    name,
    ...other
  } = props;

  return (
    <NumberFormat
      {...other}
      name={name}
      getInputRef={inputRef}
      onValueChange={({ value }) => {
        onChange({
          target: {
            name,
            value,
          },
        });
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
    errorText,
    inputProps,
    InputProps,
    ...otherProps
  } = props;

  return (
    <TextField
      autoComplete="off"
      error={!!errorText}
      helperText={errorText}
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
      {...otherProps}
    />
  );
};

CurrencyField.propTypes = {
  errorText: PropTypes.string,
  inputProps: PropTypes.object,
  InputProps: PropTypes.object,
};

