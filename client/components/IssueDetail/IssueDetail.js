import React from "react";
import PropTypes from "prop-types";
import ImmutablePropTypes from "react-immutable-proptypes";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CancelEditingIcon from "@material-ui/icons/Cancel";
import withStyles from "@material-ui/core/styles/withStyles";
import ReplyIcon from "@material-ui/icons/Reply";
import EditIcon from "@material-ui/icons/Edit";
import ReactMarkdown from "react-markdown";
import { EditorState } from "draft-js";

import { MarkdownEditor } from "+app/components/MarkdownEditor";
import { IssueHeader } from "+app/components/IssueDetail/IssueHeader";
import { IssueComment } from "+app/components/IssueDetail/IssueComment";
import { StatusChip } from "+app/components/IssueDetail/StatusChip";


const styles = (theme) => ({
  fullWidth: {
    width: "100%",
  },

  gutters: {
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
  },

  chip: {
    alignSelf: "flex-start",
    marginTop: "1em",
  },
});

/**
 * Issue detail component
 */
class IssueDetail extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
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
      currentStatus: props.issue.get("status"),
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

    this.closeReply();
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

  closeReply = () => {
    this.setState({
      replyContent: null,
      isReplying: false,
    });
  }

  handleStatusChange = ({ value }) => {
    this.setState({
      currentStatus: value,
    });

    const prevStatus = this.state.currentStatus;

    Promise.resolve(
      this.props.updateIssue({
        status: value,
      })
    ).catch(
      (ex) => {
        this.setState({
          currentStatus: prevStatus,
        });

        throw ex;
      }
    );
  }

  /**
   * Renders the component
   *
   * @return {JSX.Element}
   */
  render() {
    const {
      issue,
      classes,
    } = this.props;

    return (
      <Grid container
        direction="column"
        className={classes.gutters}
      >
        <Grid item container
          justify="space-between"
          alignItems="center"
          wrap="nowrap"
        >
          <Grid item>
            <Typography
              variant="h1"
            >
              #{issue.get("id")}: {
                issue.get("description")
              }
            </Typography>
          </Grid>
          <Grid item
            className={this.props.classes.chip}
          >
            <StatusChip
              currentStatus={this.state.currentStatus}
              onChange={this.handleStatusChange}
            />
          </Grid>
        </Grid>
        <Grid item
        >
          {
            this.state.isEditing ? (
              <MarkdownEditor
                editorState={this.state.editorState}
                onEditorStateChange={this.handleEditorStateChange}
                includeSaveButton
                raised
                cardAction={
                  <IconButton
                    onClick={this.handleToggleEnableEditingButtonClick}
                  >
                    <CancelEditingIcon />
                  </IconButton>
                }
                onSave={this.handleSaveIssueBodyClick}
              />
            ) : (
              <Card
                className={classes.fullWidth}
                raised
              >
                <IssueHeader
                  issueOrComment={issue}
                  action={
                    <IconButton
                      onClick={this.handleToggleEnableEditingButtonClick}
                    >
                      <EditIcon />
                    </IconButton>
                  }
                />
                <CardContent>
                  <ReactMarkdown
                    source={issue.get("body")}
                  />
                </CardContent>
              </Card>
            )
          }
        </Grid>
        <Grid item>
          <List>
            {
              this.props.issue.get("comments").map(
                (comment) => (
                  <ListItem
                    key={comment.get("id")}
                    disableGutters
                  >
                    <IssueComment
                      comment={comment}
                      className={classes.fullWidth}
                    />
                  </ListItem>
                )
              ).toArray()
            }
            {
              this.state.isReplying && (
                <ListItem
                  disableGutters
                >
                  <MarkdownEditor
                    className={classes.fullWidth}
                    editorState={this.state.replyContent}
                    onEditorStateChange={this.handleReplyEditorContentChange}
                    includeSaveButton
                    onSave={this.handleSaveCommentClick}
                    cardAction={
                      <IconButton
                        onClick={this.closeReply}
                      >
                        <CancelEditingIcon
                        />
                      </IconButton>
                    }
                  />
                </ListItem>
              )
            }
          </List>
          {
            !this.state.isReplying && (
              <IconButton
                onClick={this.handleReplyButtonClick}
                title="Reply"
                aria-label="Reply"
              >
                <ReplyIcon />
              </IconButton>
            )
          }
        </Grid>
      </Grid>
    );
  }
}

const StyledIssueDetail = withStyles(styles)(IssueDetail);

export { StyledIssueDetail as IssueDetail };
