import React from "react";
import PropTypes from "prop-types";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Close";

/**
 * Filter component for text data
 */
export class TextFilter extends React.PureComponent {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string,
  }

  state = {
    filterText: "",
    wasFocused: false,
  }

  textFieldRef = React.createRef()

  /**
   */
  componentDidMount() {
    if (!this.state.wasFocused && this.textFieldRef.current) {
      this.textFieldRef.current.focus();

      this.setState({
        wasFocused: true,
      });
    }
  }

  /**
   * Handles the change event of the filter input
   *
   * @param {object} args
   * @param {object} args.target
   * @param {string} args.target.value the new value of the input
   */
  handleChange = ({ target: { value } }) => {
    this.props.onChange(value);
  }

  handleClear = () => {
    this.props.onChange("");
  }

  /**
   * Renders the component
   *
   * @return {JSX.Element}
   */
  render() {
    return (
      <Card>
        <CardContent>
          <TextField
            label="Filter text"
            onChange={this.handleChange}
            value={this.props.value}
            inputRef={this.textFieldRef}
            InputProps={{
              endAdornment: this.props.value && (
                <InputAdornment
                  position="end"
                >
                  <IconButton
                    onClick={this.handleClear}
                    title="Clear Filter"
                    aria-label="Clear Filter"
                  >
                    <DeleteIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            fullWidth
          />
        </CardContent>
      </Card>
    );
  }
}
