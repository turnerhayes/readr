import React from "react";
import PropTypes from "prop-types";
import ImmutablePropTypes from "react-immutable-proptypes";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import parseISO from "date-fns/parseISO";
import format from "date-fns/format";
import isValid from "date-fns/isValid";
import {
  Formik,
  Form,
  Field,
} from "formik";

import { CurrencyField } from "+app/components/Fields/CurrencyField";
import { DatePickerField } from "+app/components/Fields/DatePickerField";
import { InputLabel } from "@material-ui/core";
import { DATE_DISPLAY_FORMAT } from "+app/constants";

const validatePaidDate = (value) => {
  if (!value) {
    return "Paid Date is required";
  }

  return isValid(new Date(value)) ?
    undefined :
    "Invalid Paid Date";
};

const validatePaidAmount = (value) => {
  if (!value) {
    return "Paid Amount is required";
  }

  if (isNaN(parseFloat(value))) {
    return "Paid Amount is not a valid number";
  }

  return undefined;
};

let componentID = 0;

/**
 * The form component rendered by Formik
 */
class FormComponent extends React.PureComponent {
  static propTypes = {
    dueDates: ImmutablePropTypes.iterableOf(
      PropTypes.string,
    ).isRequired,
    errors: PropTypes.object.isRequired,
    status: PropTypes.string,
    touched: PropTypes.object.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
    setSubmitting: PropTypes.func.isRequired,
    setFieldError: PropTypes.func.isRequired,
    setFieldValue: PropTypes.func.isRequired,
    handleReset: PropTypes.func.isRequired,
    isValid: PropTypes.bool.isRequired,
    isAPICallRunning: PropTypes.bool.isRequired,
  }

  componentID = componentID++

  /**
   */
  componentDidUpdate() {
    if (
      this.props.isSubmitting &&
      !this.props.isAPICallRunning
    ) {
      this.props.setSubmitting(false);
      this.props.handleReset();
    }
  }

  /**
   * Renders the component.
   *
   * @return {JSX.Element}
   */
  render() {
    const dueDateInputID = `dueDate-add-rent-payment-form-${this.componentID}`;

    return (
      <Form>
        <Grid container
          direction="column"
        >
          <Grid item container
            direction="column"
          >
            <InputLabel
              shrink
              htmlFor={dueDateInputID}
            >
              Due Date
            </InputLabel>
            <Field
              name="dueDate"
            >
              {
                ({ field }) => (
                  <Select
                    {...field}
                    required
                    inputProps={{
                      id: dueDateInputID,
                    }}
                  >
                    {
                      this.props.dueDates.map(
                        (date) => (
                          <MenuItem
                            key={date}
                            value={date}
                          >
                            {
                              format(
                                parseISO(date),
                                DATE_DISPLAY_FORMAT
                              )
                            }
                          </MenuItem>
                        )
                      ).toArray()
                    }
                  </Select>
                )
              }
            </Field>
          </Grid>
          <Grid item>
            <Field
              name="paidDate"
              label="Paid Date"
              validate={validatePaidDate}
              component={DatePickerField}
            />
          </Grid>
          <Grid item>
            <Field
              name="paidAmount"
              label="Paid Amount"
              validate={validatePaidAmount}
              component={CurrencyField}
            />
          </Grid>
          <Grid item>
            <Button
              type="submit"
              disabled={
                !this.props.isValid ||
                this.props.isSubmitting
              }
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </Form>
    );
  }
}

/**
 * Add Rent Payment Form component
 */
export class AddRentPaymentForm extends React.PureComponent {
  static propTypes = {
    initialValues: PropTypes.object.isRequired,
    dueDates: ImmutablePropTypes.iterableOf(
      PropTypes.string,
    ).isRequired,
    addRentPayment: PropTypes.func.isRequired,
    isAPICallRunning: PropTypes.bool.isRequired,
  }

  /**
   * Handle form submission
   *
   * @param {object} formValues the submitted form values
   * @param {string} formValues.dueDate the due date
   * @param {string} formValues.paidDate the payment date
   * @param {string} formValues.paidAmount the payment amount, as a float
   * string
   */
  handleSubmit = ({ dueDate, paidDate, paidAmount }) => {
    this.props.addRentPayment({
      dueDate: dueDate,
      paidDate: paidDate,
      // Convert to cents
      paidAmount: Math.floor(
        parseFloat(paidAmount) * 100
      ),
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
        initialValues={this.props.initialValues}
        onSubmit={(values) => this.handleSubmit(values)}
        isInitialValid={
          ({ initialValues: { paidDate, dueDate, paidAmount } }) => {
            return !!dueDate &&
              (
                !paidDate ||
                isValid(parseISO(paidDate))
              ) &&
              (
                !paidAmount ||
                !isNaN(parseFloat(paidAmount))
              );
          }
        }
      >
        {
          (props) => (
            <FormComponent
              {...props}
              dueDates={this.props.dueDates}
              isAPICallRunning={this.props.isAPICallRunning}
            />
          )
        }
      </Formik>
    );
  }
}

