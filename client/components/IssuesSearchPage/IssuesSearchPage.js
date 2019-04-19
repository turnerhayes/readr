import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { useDispatch, useMappedState } from "redux-react-hook";
import { Link } from "react-router-dom";
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

import { searchIssues } from "+app/actions";
import { Chip } from "@material-ui/core";

const styles = {
  issueLink: {
    marginLeft: "1em",
  },
};

const IssuesSearchPage = ({ classes, search }) => {
  const mapState = useCallback(
    (state) => {
      const resultIDs = state.issues.get("searchResults");

      let results = null;

      if (resultIDs && !resultIDs.isEmpty()) {
        results = state.issues.get("items").filter(
          (item) => resultIDs.includes(item.get("id"))
        );
      }

      return ({
        results,
      });
    },
    []
  );

  const { results } = useMappedState(mapState);

  const dispatch = useDispatch();

  if (search !== null && results === null) {
    dispatch(
      searchIssues({
        searchQuery: search.query,
      })
    );

    return (
      <div>
        Searching...
      </div>
    );
  }

  return (
    <Grid container>
      <Grid item>
        <form>
        </form>
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
            (
              <Typography
                variant="body2"
              >
                No results
              </Typography>
            )
        }
      </Grid>
    </Grid>
  );
};

IssuesSearchPage.propTypes = {
  classes: PropTypes.object.isRequired,
  search: PropTypes.shape({
    query: PropTypes.string,
  }),
};

const StyledIssuesSearchPage = withStyles(styles)(IssuesSearchPage);

export { StyledIssuesSearchPage as IssuesSearchPage };
