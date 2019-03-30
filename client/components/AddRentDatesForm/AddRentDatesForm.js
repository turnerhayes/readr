import React from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { InputLabel } from "@material-ui/core";
import format from "date-fns/format";
import isValid from "date-fns/isValid";
import {
  Formik,
  Form,
  Field,
} from "formik";
import { DatePicker } from "material-ui-pickers";

import { CurrencyField } from "+app/components/Fields/CurrencyField";

const RENT_PERIOD_OPTIONS = [
  {
    name: "monthly",
    label: "Monthly",
  },
  {
    name: "weekly",
    label: "Weekly",
  },
];

const validateNumDates = (value) => {
  if (value === "" || value < 1) {
    return "Number of rent dates must be greater than 0";
  }

  return undefined;
};

const validateDueAmountPerDate = (value) => {
  if (value === "" || value <= 0) {
    return "Due Amount must be greater than 0";
  }

  return undefined;
};

const validatefirstRentDate = (value) => {
  if (value === null || value === "") {
    return "First Due Date is required";
  }

  if (!isValid(value)) {
    return "First Due Date is not a valid date";
  }

  return undefined;
};

const validateForm = (values) => {
  if (values.numDates > 1 && !values.rentPeriod) {
    return "Must specify a rent period if there is more than one date";
  }

  return undefined;
};

const DatePickerField = ({ field, form }) => (
  <DatePicker
    format="dd/MM/yyyy"
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

const checkIsInitialValid = ({
  initialValues: {
    numDates,
    dueAmountPerDate,
    firstRentDate,
    rentPeriod,
  },
}) => {
  return !validateNumDates(numDates) &&
    !validateDueAmountPerDate(dueAmountPerDate) &&
    !validatefirstRentDate(firstRentDate);
};

let componentID = 0;

/**
 * The form component rendered by Formik
 */
class FormComponent extends React.PureComponent {
  static propTypes = {
    isValid: PropTypes.bool.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
    setSubmitting: PropTypes.func.isRequired,
    handleReset: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
    touched: PropTypes.object.isRequired,
    values: PropTypes.object.isRequired,
    isAPICallRunning: PropTypes.bool.isRequired,
  }

  componentID = componentID++

  /**
   * @param {object} oldProps
   */
  componentDidUpdate(oldProps) {
    if (
      this.props.isSubmitting &&
      oldProps.isAPICallRunning &&
      !this.props.isAPICallRunning
    ) {
      this.props.setSubmitting(false);
      this.props.handleReset();
    }
  }


  /**
   * Renders the component
   *
   * @return {JSX.Element}
   */
  render() {
    const {
      isSubmitting,
      isValid,
      errors,
      touched,
      values,
    } = this.props;

    return (
      <Form>
        <Grid container
          direction="column"
        >
          <Grid item>
            <Field
              name="firstRentDate"
              component={DatePickerField}
              validate={validatefirstRentDate}
            >
            </Field>
          </Grid>
          <Grid item>
            <Field
              name="numDates"
              validate={validateNumDates}
            >
              {
                ({ field }) => (
                  <TextField
                    type="number"
                    label="Number of rent dates"
                    helperText={
                      touched.numDates ?
                        errors.numDates :
                        ""
                    }
                    error={Boolean(errors.numDates && touched.numDates)}
                    inputProps={{
                      min: 1,
                      step: 1,
                    }}
                    {...field}
                  />
                )
              }
            </Field>
          </Grid>
          {
            values.numDates > 1 && (
              <Grid item>
                <Field
                  name="rentPeriod"
                >
                  {
                    ({ field }) => (
                      <React.Fragment>
                        <InputLabel
                          shrink
                          htmlFor={`rentPeriodSelect-${this.componentID}`}
                        >
                          Rent Period
                        </InputLabel>
                        <Select
                          {...field}
                          inputProps={{
                            id: `rentPeriodSelect-${this.componentID}`,
                          }}
                        >
                          {
                            RENT_PERIOD_OPTIONS.map(
                              ({ name, label }) => (
                                <MenuItem
                                  key={name}
                                  value={name}
                                >
                                  {label}
                                </MenuItem>
                              )
                            )
                          }
                        </Select>
                      </React.Fragment>
                    )
                  }
                </Field>
              </Grid>
            )
          }
          <Grid item>
            <Field
              name="dueAmountPerDate"
              validate={validateDueAmountPerDate}
            >
              {
                ({ field }) => (
                  <CurrencyField
                    label="Amount due per rent date"
                    {...field}
                  />
                )
              }
            </Field>
          </Grid>
        </Grid>
        <Button
          type="submit"
          disabled={
            !isValid ||
            isSubmitting
          }
        >
          Submit
        </Button>
      </Form>
    );
  }
}

/**
 * Add rent dates form component
 */
export class AddRentDatesForm extends React.PureComponent {
  static propTypes = {
    addRentDates: PropTypes.func.isRequired,
    isAPICallRunning: PropTypes.bool.isRequired,
  }

  handleSubmit = ({
    numDates,
    dueAmountPerDate,
    firstRentDate,
    rentPeriod,
  }) => {
    firstRentDate = format(
      firstRentDate,
      "yyyy-MM-dd"
    );

    // convert to cents
    dueAmountPerDate = Math.floor(parseFloat(dueAmountPerDate) * 100);

    this.props.addRentDates({
      numDates,
      dueAmountPerDate,
      firstRentDate,
      rentPeriod,
    });
  }

  /**
   * Renders the component.
   *
   * @return {JSX.Element}
   */
  render() {
    return (
      <Formik
        onSubmit={this.handleSubmit}
        validate={validateForm}
        initialValues={{
          firstRentDate: null,
          dueAmountPerDate: "",
          numDates: 1,
          rentPeriod: RENT_PERIOD_OPTIONS[0].name,
        }}
        isInitialValid={checkIsInitialValid}
      >
        {
          (props) => (
            <FormComponent
              {...props}
              isAPICallRunning={this.props.isAPICallRunning}
            />
          )
        }
      </Formik>
    );
  }
}

