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
import {
  EditorState,
  convertFromRaw,
  convertToRaw,
} from "draft-js";
import {
  mdToDraftjs,
  draftjsToMd,
} from "draftjs-md-converter";
import { Editor } from "react-draft-wysiwyg";
import parseISO from "date-fns/parseISO";
import formatRelative from "date-fns/formatRelative";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const TOOLBAR_OPTIONS = {
  options: [
    "inline",
    "blockType",
    "fontSize",
    "list",
    "link",
    "emoji",
    "image",
    "remove",
    "history",
  ],
  inline: {
    options: [
      "bold",
      "italic",
      "underline",
      "strikethrough",
    ],
  },
};

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
   * @param  {...any} args same as for React.Component
   */
  constructor(props, ...args) {
    super(props, ...args);

    this.state = {
      editorState: EditorState.createWithContent(
        convertFromRaw(mdToDraftjs(props.issue.get("body")))
      ),
      isEditing: false,
    };
  }

  /**
   * Handles the editor"s state change event
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

  handleSaveBodyClick = () => {
    const body = draftjsToMd(
      convertToRaw(
        this.state.editorState.getCurrentContent()
      )
    );

    this.props.updateIssue({
      body,
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
              <Editor
                editorState={this.state.editorState}
                onEditorStateChange={this.handleEditorStateChange}
                toolbar={TOOLBAR_OPTIONS}
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
