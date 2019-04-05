import React from "react";
import PropTypes from "prop-types";
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
  withStyles,
} from "@material-ui/core";

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

/**
 * Markdown editor component
 */
class MarkdownEditor extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    editorState: PropTypes.instanceOf(EditorState).isRequired,
    toolbar: PropTypes.object,
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
   * Renders the component.
   *
   * @return {JSX.Element}
   */
  render() {
    const {
      toolbar,
      classes,
      ...otherProps
    } = this.props;

    return (
      <Card>
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

