import React from "react";
import PropTypes from "prop-types";
import ImmutablePropTypes from "react-immutable-proptypes";
import {
  Grid,
  Typography,
  IconButton,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import CancelEditingIcon from "@material-ui/icons/Cancel";
import SaveIcon from "@material-ui/icons/Save";
import ReactMarkdown from "react-markdown";
import parseISO from "date-fns/parseISO";
import formatRelative from "date-fns/formatRelative";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { MarkdownEditor } from "../MarkdownEditor";


const SaveToolbarButton = ({ onClick }) => {
  return (
    <IconButton
      onClick={onClick}
    >
      <SaveIcon />
    </IconButton>
  );
};

SaveToolbarButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

/**
 * Issue detail component
 */
export class IssueDetail extends React.PureComponent {
  static propTypes = {
    issue: ImmutablePropTypes.map.isRequired,
    updateIssue: PropTypes.func.isRequired,
  }

  /**
   * Constructs an IssueDetail component
   *
   * @param {object} props same as for React.Component
   * @param  {...any[]} args same as for React.Component
   */
  constructor(props, ...args) {
    super(props, ...args);

    this.state = {
      editorState: MarkdownEditor.markdownToEditorState(
        props.issue.get("body")
      ),
      isEditing: false,
    };
  }

  /**
   * Converts the current editor state to a Markdown string
   *
   * @return {string}
   */
  getCurrentMarkdown = () => {
    return MarkdownEditor.editorStateToMarkdown(this.state.editorState);
  }

  /**
   * Handles the editor's editor state change event
   *
   * @param {EditorState} editorState the new state
   */
  handleEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  }

  /**
   * Handles the click event for the enable/disable editing button
   */
  handleToggleEnableEditingButtonClick = () => {
    this.setState(({ isEditing }) => ({
      isEditing: !isEditing,
    }));
  }

  /**
   * Handles a click of the Save toolbar button
   */
  handleSaveBodyClick = () => {
    this.props.updateIssue({
      body: this.getCurrentMarkdown(),
    });
  }

  /**
   * Renders the component
   *
   * @return {JSX.Element}
   */
  render() {
    return (
      <Grid container
        direction="column"
      >
        <Grid item>
          <Typography
            variant="h1"
          >
            #{this.props.issue.get("id")}: {
              this.props.issue.get("description")
            }
          </Typography>
        </Grid>
        <Grid item>
            Created {
            formatRelative(
              parseISO(this.props.issue.get("createdAt")),
              new Date()
            )
          } by {
            this.props.issue.getIn([
              "createdBy",
              "name",
              "display",
            ]) ||
            this.props.issue.get("createdByText")
          }
        </Grid>
        <Grid item>
          <IconButton
            onClick={this.handleToggleEnableEditingButtonClick}
          >
            {
              this.state.isEditing ? (
                <CancelEditingIcon />
              ) : (
                <EditIcon />
              )
            }
          </IconButton>
          {
            this.state.isEditing ? (
              <MarkdownEditor
                editorState={this.state.editorState}
                onEditorStateChange={this.handleEditorStateChange}
                toolbarCustomButtons={[
                  (
                    <SaveToolbarButton
                      key="save"
                      onClick={this.handleSaveBodyClick}
                    />
                  ),
                ]}
              />
            ) : (
              <ReactMarkdown
                source={this.props.issue.get("body")}
              />
            )
          }
        </Grid>
      </Grid>
    );
  }
}
