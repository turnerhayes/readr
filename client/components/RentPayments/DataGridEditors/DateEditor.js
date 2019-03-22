import React from "react";
import PropTypes from "prop-types";
import TextField from "@material-ui/core/TextField";
import { format } from "date-fns";

import { NumberOrEmptyStringPropType } from "../PropTypes";

/**
 * Date cell editor component
 */
export class DateEditor extends React.PureComponent {
  static propTypes = {
    defaultValue: NumberOrEmptyStringPropType,
  }

  inputRef = React.createRef()

  /**
   * Gets the DOM node for the input element
   *
   * @return {HTMLInputElement}
   */
  getInputNode() {
    return this.inputRef.current;
  }

  /**
   * Gets the value of the input
   *
   * @return {Date}
   */
  getValue() {
    return this.getInputNode().valueAsDate;
  }

  /**
   * Renders the component
   *
   * @return {React.ReactElement}
   */
  render() {
    return (
      <TextField
        type="date"
        inputRef={this.inputRef}
        defaultValue={
          this.props.defaultValue === undefined ?
            undefined :
            format(
              this.props.defaultValue,
              "YYYY-MM-DD"
            )
        }
      />
    );
  }
}


/**
 * Date editor that defaults to due date
 */
export class DefaultingDateEditor extends React.PureComponent {
  static propTypes = {
    value: NumberOrEmptyStringPropType,
    rowData: PropTypes.shape({
      dueDate: PropTypes.number.isRequired,
    }).isRequired,
  }

  ref = React.createRef()

  /**
   * Gets the DOM node for the input element
   *
   * @return {HTMLInputElement}
   */
  getInputNode() {
    return this.ref.current.getInputNode();
  }

  /**
   * Gets the value of the input
   *
   * @return {Date}
   */
  getValue() {
    return this.ref.current.getValue();
  }

  /**
   * Renders the component
   *
   * @return {React.ReactElement}
   */
  render() {
    return (
      <DateEditor
        defaultValue={
          this.props.value || this.props.rowData.dueDate
        }
        ref={this.ref}
      />
    );
  }
}
