import React from "react";
import PropTypes from "prop-types";
import { Formik, Form, Field } from "formik";
import { Grid, TextField, Typography, Button } from "@material-ui/core";
import { EditorState } from "draft-js";

import { MarkdownEditor } from "+app/components/MarkdownEditor";

/**
 * Add Issue page component
 */
export class AddIssue extends React.PureComponent {
  static propTypes = {
    addIssue: PropTypes.func.isRequired,
  }

  handleSubmit = ({
    description,
    body,
  }) => {
    body = MarkdownEditor.editorStateToMarkdown(body);

    this.props.addIssue({
      description,
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
      <Formik
        onSubmit={this.handleSubmit}
        initialValues={{
          description: "",
          body: EditorState.createEmpty(),
        }}
      >
        <Form>
          <Grid container
            direction="column"
            alignItems="center"
          >
            <Grid item
            >
              <Typography
                variant="h2"
              >
                Add Issue
              </Typography>
            </Grid>
            <Grid item>
              <Field
                name="description"
              >
                {
                  ({ field, form: { errors, touched } }) => (
                    <TextField
                      {...field}
                      label="Description"
                      error={
                        Boolean(errors[field.name] && touched[field.name])
                      }
                      helperText={
                        errors[field.name] && touched[field.name] ?
                          errors[field.name] :
                          ""
                      }
                      required
                    />
                  )
                }
              </Field>
            </Grid>
            <Grid item>
              <Field
                name="body"
              >
                {
                  ({
                    field: {
                      onChange,
                      onBlur,
                      ...field
                    },
                    form: { setFieldValue },
                  }) => (
                    <MarkdownEditor
                      {...field}
                      editorState={field.value}
                      onEditorStateChange={(editorState) => {
                        setFieldValue(
                          field.name,
                          editorState
                        );
                      }}
                      required
                    />
                  )
                }
              </Field>
            </Grid>
            <Grid item>
              <Button
                type="submit"
              >
                Add Issue
              </Button>
            </Grid>
          </Grid>
        </Form>
      </Formik>
    );
  }
}
