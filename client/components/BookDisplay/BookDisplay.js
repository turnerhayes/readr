import React from "react";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import NextIcon from "@material-ui/icons/NavigateNext";
import PreviousIcon from "@material-ui/icons/NavigateBefore";

import { BookPicker } from "+app/components/BookDisplay/BookPicker";

const useStyles = makeStyles({
  iframe: {
    width: "100%",
    border: "none",
  },
});

export const BookDisplay = () => {
  const [selectedBook, setSelectedBook] = React.useState(null);

  const classes = useStyles();

  const handleNextPageClick = React.useCallback(
    () => {
    },
    []
  );

  const handlePreviousPageClick = React.useCallback(
    () => {
    },
    []
  );

  const handleBookSelected = React.useCallback(
    (bookName) => {
      setSelectedBook(bookName);
    },
    []
  );

  return (
    <Grid container
      direction="column"
    >
      <BookPicker
        bookName={selectedBook}
        onBookSelected={handleBookSelected}
      />
      {
        selectedBook !== null && (
          <Grid item container
            direction="column"
          >
            <Grid item>
              <iframe
                src={`/api/epub/${selectedBook}/0/`}
                className={classes.iframe}
              ></iframe>
            </Grid>
            <Grid item container
              justify="center"
            >
              <IconButton
                onClick={handlePreviousPageClick}
              >
                <PreviousIcon />
              </IconButton>
              <IconButton
                onClick={handleNextPageClick}
              >
                <NextIcon />
              </IconButton>
            </Grid>
          </Grid>
        )
      }
    </Grid>
  );
};
