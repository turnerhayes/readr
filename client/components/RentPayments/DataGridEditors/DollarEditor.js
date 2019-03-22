import React from "react";
import PropTypes from "prop-types";
import TextField from "@material-ui/core/TextField";

/**
 * Editor component for dollar amount cells
 */
export class DollarEditor extends React.PureComponent {
  static propTypes = {
    value: PropTypes.string,
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
   * @return {number}
   */
  getValue() {
    return this.getInputNode().valueAsNumber;
  }

  /**
   * Renders the component
   *
   * @return {React.ReactElement}
   */
  render() {
    return (
      <TextField
        type="number"
        value={this.props.value}
        inputRef={this.inputRef}
        inputProps={{
          step: 0.1,
          min: 0,
        }}
      />
    );
  }
}
