import React from "react";
import PropTypes from "prop-types";
import ImmutablePropTypes from "react-immutable-proptypes";
import { Link } from "react-router-dom";
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Chip from "@material-ui/core/Chip";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Select, { Async as AsyncSelect } from "react-select";
import {
  Formik,
  Form,
  Field,
} from "formik";

import { ISSUE_STATUSES } from "+app/constants";
import { getIssueUsers } from "+app/api";

const styles = {
  issueLink: {
    marginLeft: "1em",
  },
};

const RETURN_SELF = (val) => val;

const formStyles = {
  statusSelect: {
    minWidth: "10em",
    display: "inline-block",
    marginLeft: "1em",
  },

  activityBySelect: {
    minWidth: "10em",
    display: "inline-block",
    marginLeft: "1em",
  },
};

/**
 * The component containing the actual search form
 */
class FormComponent extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    setFieldValue: PropTypes.func.isRequired,
  }

  /**
   * Handles the change event for the statuses selection
   *
   * @param {string[]} selected the selected options
   */
  handleStatusSelectionChange = (selected) => {
    this.props.setFieldValue("selectedStatuses", selected);
  }

  /**
   * Handles the change event for the activity by selection
   *
   * @param {object[]} selected the selected options
   */
  handleActivityBySelectionChange = (selected) => {
    this.props.setFieldValue(
      "selectedActivityBy",
      selected,
    );
  }

  /**
   * Loads the options for the activity by select
   *
   * @param {string} input the current text to filter by
   *
   * @return {Promise<Array<{value: object, label: string}>>}
   */
  async loadActivityByOptions(input) {
    const users = await getIssueUsers({
      nameFilter: input,
      onlyActiveOnIssues: true,
    });

    return users.toArray();
  }

  /**
   * Renders the component.
   *
   * @return {JSX.Element}
   */
  render() {
    const {
      classes,
    } = this.props;

    return (
      <Form>
        <Grid container
          direction="column"
        >
          <Grid item>
            <Field
              name="query"
            >
              {
                ({ field }) => (
                  <TextField
                    {...field}
                    label="Containing text"
                  />
                )
              }
            </Field>
          </Grid>
          <Grid item>
            <Field
              name="selectedStatuses"
            >
              {
                ({ field }) => (
                  <label>
                    In status
                    <Select
                      {...field}
                      getOptionLabel={RETURN_SELF}
                      getOptionValue={RETURN_SELF}
                      options={ISSUE_STATUSES}
                      className={classes.statusSelect}
                      placeholder="Status(es)"
                      onChange={this.handleStatusSelectionChange}
                      isClearable
                      isMulti
                    />
                  </label>
                )
              }
            </Field>
          </Grid>
          <Grid item>
            <Field
              name="selectedActivityBy"
            >
              {
                ({ field, form }) => (
                  <label>
                    With activity by
                    <AsyncSelect
                      {...field}
                      getOptionLabel={
                        (user) => user.get("text") || user.get("name")
                      }
                      getOptionValue={RETURN_SELF}
                      loadOptions={this.loadActivityByOptions}
                      defaultOptions={form.initialValues[field.name]}
                      className={classes.activityBySelect}
                      placeholder="Users"
                      onChange={this.handleActivityBySelectionChange}
                      isClearable
                      isMulti
                    />
                  </label>
                )
              }
            </Field>
          </Grid>
        </Grid>

        <Button
          type="submit"
        >
          Search
        </Button>
      </Form>
    );
  }
}

const StyledFormComponent = withStyles(formStyles)(FormComponent);

/**
 * Component for the issues search page
 */
class IssuesSearchPage extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    query: PropTypes.string,
    selectedStatuses: PropTypes.arrayOf(
      PropTypes.oneOf(ISSUE_STATUSES)
    ),
    selectedActivityBy: PropTypes.arrayOf(
      PropTypes.object
    ),
    results: ImmutablePropTypes.iterableOf(
      ImmutablePropTypes.map
    ),
    changeSearch: PropTypes.func.isRequired,
  }

  static defaultProps = {
    query: "",
    selectedStatuses: [],
    selectedActivityBy: [],
  }

  /**
   * Returns true if the component has any search criteria currently set,
   * false otherwise
   *
   * @param {object} values the current form values
   *
   * @return {boolean}
   */
  hasSearchCriteria(values) {
    return Boolean(
      values.query ||
      (
        values.selectedStatuses &&
        values.selectedStatuses.length > 0
      ) ||
      (
        values.selectedActivityBy &&
        values.selectedActivityBy.length > 0
      )
    );
  }

  /**
   * Handles the submit event of the search form
   *
   * @param {object} search the form values
   * @param {string} search.query the query string
   * @param {object[]} search.selectedStatuses the statuses to search for
   * @param {object[]} search.selectedActivityBy users who need to have
   * taken an action (create, update) on the issue or any of its comments
   */
  handleSubmit = ({
    query,
    selectedStatuses,
    selectedActivityBy,
  }) => {
    if (selectedActivityBy) {
      selectedActivityBy = selectedActivityBy.map(
        (user) => user.toJS()
      );
    }

    this.props.changeSearch({
      query,
      selectedStatuses,
      selectedActivityBy,
    });
  }

  /**
   * Renders the component.
   *
   * @return {JSX.Element}
   */
  render() {
    const {
      classes,
      results,
      query,
      selectedStatuses,
      selectedActivityBy,
    } = this.props;

    const initialValues = {
      query,
      selectedStatuses,
      selectedActivityBy,
    };

    return (
      <Formik
        onSubmit={this.handleSubmit}
        initialValues={initialValues}
      >
        {
          (props) => (
            <Grid container
              direction="column"
            >
              <Grid item>
                <StyledFormComponent
                  {...props}
                />
              </Grid>
              <Grid item>
                {
                  results && !results.isEmpty() ?
                    (
                      <List>
                        {
                          results.valueSeq().map(
                            (result) => (
                              <ListItem
                                key={result.get("id")}
                              >
                                <Grid container
                                  alignItems="center"
                                >
                                  <Grid item>
                                    <Chip
                                      label={result.get("status")}
                                    />
                                  </Grid>
                                  <Grid item
                                    className={classes.issueLink}
                                  >
                                    <Link
                                      to={`/issues/${result.get("id")}`}
                                    >
                                      {result.get("description")}
                                    </Link>
                                  </Grid>
                                </Grid>
                              </ListItem>
                            )
                          ).toArray()
                        }
                      </List>
                    ) :
                    this.hasSearchCriteria(props.values) && (
                      <Typography
                        variant="body2"
                      >
                        No results
                      </Typography>
                    )
                }
              </Grid>
            </Grid>
          )
        }
      </Formik>
    );
  }
}

const StyledIssuesSearchPage = withStyles(styles)(IssuesSearchPage);

export { StyledIssuesSearchPage as IssuesSearchPage };
