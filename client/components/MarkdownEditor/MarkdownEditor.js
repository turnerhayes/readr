import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import {
  EditorState,
  convertToRaw,
  convertFromRaw,
} from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import {
  draftjsToMd,
  mdToDraftjs,
} from "draftjs-md-converter";
import {
  Card,
  CardContent,
  IconButton,
  withStyles,
  CardHeader,
} from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const MARKDOWN_DICTIONARY = {
  BOLD: "__",
  ITALIC: "*",
  STRIKETHROUGH: "~~",
};

const DEFAULT_TOOLBAR_OPTIONS = {
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

const styles = {
  editor: {
    maxHeight: "60vh",
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
 * Markdown editor component
 */
class MarkdownEditor extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    editorState: PropTypes.instanceOf(EditorState).isRequired,
    toolbar: PropTypes.object,
    includeSaveButton: PropTypes.bool.isRequired,
    onSave: PropTypes.func,
    cardAction: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.string,
    ]),
    raised: PropTypes.bool,
  }

  static defaultProps = {
    includeSaveButton: false,
  }

  /**
   * Convenience method for converting an editor state's current
   * content to a Markdown string
   *
   * @param {EditorState} editorState the editor state to convert
   *
   * @return {string}
   */
  static editorStateToMarkdown(editorState) {
    return draftjsToMd(
      convertToRaw(
        editorState.getCurrentContent()
      ),
      MARKDOWN_DICTIONARY
    );
  }

  /**
   * Converts a Markdown string to a DraftJS editor state
   *
   * @param {string} markdown the markdown string
   *
   * @return {EditorState}
   */
  static markdownToEditorState(markdown) {
    return EditorState.createWithContent(
      convertFromRaw(mdToDraftjs(markdown))
    );
  }

  /**
   * Handles a click of the Save toolbar button
   */
  handleSaveClick = () => {
    if (this.props.onSave) {
      this.props.onSave();
    }
  }

  /**
   * Renders the component.
   *
   * @return {JSX.Element}
   */
  render() {
    const {
      toolbar,
      includeSaveButton,
      classes,
      className,
      cardAction,
      raised,
      ...otherProps
    } = this.props;

    const actions = [];

    if (includeSaveButton) {
      actions.push(
        <SaveToolbarButton
          key="saveButton"
          onClick={this.handleSaveClick}
        />
      );
    }

    if (cardAction) {
      actions.push(
        React.cloneElement(
          cardAction,
          {
            key: "cardAction",
          }
        )
      );
    }

    return (
      <Card
        className={classnames(
          className,
          classes.root
        )}
        raised={raised}
      >
        {
          actions.length > 0 && (
            <CardHeader
              action={
                <React.Fragment>
                  {actions}
                </React.Fragment>
              }
            />
          )
        }
        <CardContent>
          <Editor
            editorClassName={classes.editor}
            toolbar={{
              ...DEFAULT_TOOLBAR_OPTIONS,
              ...toolbar,
            }}
            {...otherProps}
          />
        </CardContent>
      </Card>
    );
  }
}

const StyledMarkdownEditor = withStyles(styles)(MarkdownEditor);

export { StyledMarkdownEditor as MarkdownEditor };

