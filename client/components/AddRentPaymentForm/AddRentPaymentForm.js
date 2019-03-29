import React from "react";
import PropTypes from "prop-types";
import ImmutablePropTypes from "react-immutable-proptypes";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import { DatePicker } from "material-ui-pickers";
import parseISO from "date-fns/parseISO";
import format from "date-fns/format";
import isValid from "date-fns/isValid";
import {
  Formik,
  Form,
  Field,
  ErrorMessage,
} from "formik";

import { CurrencyField } from "+app/components/Fields/CurrencyField";

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

/**
 * The form component rendered by Formik
 */
class FormComponent extends React.PureComponent {
  static propTypes = {
    dueDates: ImmutablePropTypes.iterableOf(
      PropTypes.string,
    ).isRequired,
    errors: PropTypes.object,
    status: PropTypes.string,
    touched: PropTypes.object,
    isSubmitting: PropTypes.bool,
    setSubmitting: PropTypes.func,
    isValid: PropTypes.bool,
    isAPICallRunning: PropTypes.bool.isRequired,
  }

  /**
   */
  componentDidUpdate() {
    if (
      this.props.isSubmitting &&
      !this.props.isAPICallRunning
    ) {
      this.props.setSubmitting(false);
    }
  }

  /**
   * Renders the component.
   *
   * @return {JSX.Element}
   */
  render() {
    return (
      <Form>
        <FormControl
          component="fieldset"
        >
          <FormLabel
            component="legend"
          >
            Add Rent Payment
          </FormLabel>
          <div>
            <Field
              name="dueDate"
              label="Due Date"
            >
              {
                ({ field }) => (
                  <Select
                    {...field}
                    required
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
                                "MMM yyyy"
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
          </div>
          <div>
            <Field
              name="paidDate"
              label="Paid Date"
              validate={validatePaidDate}
            >
              {
                ({ field }) => (
                  <DatePicker
                    {...field}
                    format="yyyy-MM-dd"
                    keyboard
                    required
                  />
                )
              }
            </Field>
            <ErrorMessage
              name="paidDate"
            />
          </div>
          <div>
            <Field
              name="paidAmount"
              validate={validatePaidAmount}
            >
              {
                ({ field }) => (
                  <CurrencyField
                    {...field}
                    errorText={this.props.errors.paidAmount}
                    required
                  />
                )
              }
            </Field>
            <ErrorMessage
              name="paidAmount"
            />
          </div>
          <div>
            <Button
              type="submit"
              disabled={
                !this.props.isValid ||
                this.props.isSubmitting
              }
            >
              Submit
            </Button>
          </div>
        </FormControl>
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

