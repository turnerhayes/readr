import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import withStyles from "@material-ui/core/styles/withStyles";
import AddIcon from "@material-ui/icons/Add";

import { IssuesGridContainer } from "+app/components/IssuesGrid";


const styles = {
  root: {
    height: "100%",
  },

  gridContainer: {
    flex: 1,
    minHeight: 0,
  },

  grid: {
    maxHeight: "100%",
  },

  searchContainer: {
    marginRight: "auto",
    marginLeft: "2em",
  },

  form: {
    display: "flex",
    alignContent: "center",
  },
};

/**
 * Issues page component
 */
class Issues extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  }

  /**
   * Renders the component
   *
   * @return {JSX.Element}
   */
  render() {
    const {
      classes,
    } = this.props;

    return (
      <Grid container
        direction="column"
        wrap="nowrap"
        className={this.props.classes.root}
      >
        <Grid item container
          wrap="nowrap"
        >
          <Grid item>
            <Typography
              variant="h2"
            >Issues</Typography>
          </Grid>
          <Grid item
            className={classes.searchContainer}
          >
            <form
              action="/issues/search"
              method="get"
              className={classes.form}
            >
              <TextField
                type="search"
                label="Search Issues"
                name="query"
              />
              <Button
                type="submit"
              >
                Search
              </Button>
            </form>
          </Grid>
          <Grid item>
            <IconButton
              component={Link}
              to="/issues/add"
              title="Add an issue"
              aria-label="Add an issue"
            >
              <AddIcon />
            </IconButton>
          </Grid>
        </Grid>
        <Grid item
          className={this.props.classes.gridContainer}
        >
          <IssuesGridContainer
            className={this.props.classes.grid}
          />
        </Grid>
      </Grid>
    );
  }
}

const StyledIssues = withStyles(styles)(Issues);

export { StyledIssues as Issues };
