import React from "react";
import PropTypes from "prop-types";

/** Error Boundary component */
export class ErrorHandler extends React.PureComponent {
  static propTypes = {
    children: PropTypes.any,
  }

  state = {
    error: null,
  }

  /**
   * Gets state from the thrown error
   *
   * @param {*} error the thrown error
   *
   * @return {object}
   */
  static getDerivedStateFromError(error) {
    return { error };
  }

  /**
   * Called when the component catches an error
   *
   * @param {*} error
   */
  componentDidCatch(error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }

  /**
   * Renders the component
   *
   * @return {JSX.Element}
   */
  render() {
    if (this.state.error) {
      return (
        <div>
          <pre>
            <code>
              {JSON.stringify(
                {
                  message: this.state.error.message,
                  stack: this.state.error.stack,
                },
                null,
                "  "
              )}
            </code>
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}
