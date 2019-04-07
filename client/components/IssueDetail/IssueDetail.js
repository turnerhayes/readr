import React from "react";
import PropTypes from "prop-types";
import ImmutablePropTypes from "react-immutable-proptypes";
import {
  Grid,
  Typography,
  IconButton,
  ListItem,
  List,
  Card,
  CardContent,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import CancelEditingIcon from "@material-ui/icons/Cancel";
import ReplyIcon from "@material-ui/icons/Reply";
import ReactMarkdown from "react-markdown";
import { EditorState } from "draft-js";
import parseISO from "date-fns/parseISO";
import formatRelative from "date-fns/formatRelative";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import { MarkdownEditor } from "+app/components/MarkdownEditor";


const IssueComment = ({ comment }) => {
  return (
    <ListItem>
      <Card>
        <CardContent>
          <ReactMarkdown
            source={comment.get("body")}
          />
        </CardContent>
      </Card>
    </ListItem>
  );
};

IssueComment.propTypes = {
  comment: ImmutablePropTypes.map.isRequired,
};

/**
 * Issue detail component
 */
export class IssueDetail extends React.PureComponent {
  static propTypes = {
    issue: ImmutablePropTypes.map.isRequired,
    updateIssue: PropTypes.func.isRequired,
    addComment: PropTypes.func.isRequired,
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
      isReplying: false,
      replyContent: null,
    };
  }

  /**
   * Converts the current issue editor state to a Markdown string
   *
   * @return {string}
   */
  getCurrentIssueMarkdown = () => {
    return MarkdownEditor.editorStateToMarkdown(this.state.editorState);
  }

  /**
   * Converts the current comment editor state to a Markdown string
   *
   * @return {string}
   */
  getCurrentCommentMarkdown = () => {
    return MarkdownEditor.editorStateToMarkdown(this.state.replyContent);
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
   * Handles a click of the Save toolbar button for the issue editor
   */
  handleSaveIssueBodyClick = () => {
    this.props.updateIssue({
      body: this.getCurrentIssueMarkdown(),
    });
  }

  /**
   * Handles a click of the Save toolbar button for the comment editor
   */
  handleSaveCommentClick = async () => {
    await this.props.addComment({
      body: this.getCurrentCommentMarkdown(),
    });

    this.setState({
      replyContent: null,
      isReplying: false,
    })
  }

  /**
   * Handles a click of the Reply button
   */
  handleReplyButtonClick = () => {
    this.setState((prevState) => {
      const newState = {
        isReplying: true,
      };

      if (prevState.replyContent === null) {
        newState.replyContent = EditorState.createEmpty();
      }

      return newState;
    });
  }

  /**
   * Handles change of the reply editor's state
   *
   * @param {EditorState} editorState the new editor state
   */
  handleReplyEditorContentChange = (editorState) => {
    this.setState({
      replyContent: editorState,
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
                includeSaveButton
                onSave={this.handleSaveIssueBodyClick}
              />
            ) : (
              <ReactMarkdown
                source={this.props.issue.get("body")}
              />
            )
          }
        </Grid>
        <Grid item>
          <List>
            {
              this.props.issue.get("comments").map(
                (comment) => (
                  <IssueComment
                    key={comment.get("id")}
                    comment={comment}
                  />
                )
              ).toArray()
            }
          </List>
          <IconButton
            onClick={this.handleReplyButtonClick}
            title="Reply"
            aria-label="Reply"
          >
            <ReplyIcon />
          </IconButton>
        </Grid>
        {
          this.state.isReplying && (
            <Grid item>
              <MarkdownEditor
                editorState={this.state.replyContent}
                onEditorStateChange={this.handleReplyEditorContentChange}
                includeSaveButton
                onSave={this.handleSaveCommentClick}
              />
            </Grid>
          )
        }
      </Grid>
    );
  }
}
