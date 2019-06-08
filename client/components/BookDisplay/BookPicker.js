import React from "react";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

import { getBookNames } from "+app/actions";
import {
  useDispatch,
  useMappedState,
} from "redux-react-hook";

export const BookPicker = ({ bookName, onBookSelected }) => {
  const [isFetchingBooks, setIsFetchingBooks] = React.useState(false);
  const mapStateToProps = React.useCallback(
    (state) => ({
      bookNames: state.books.keySeq().toList(),
    }),
    []
  );

  const { bookNames } = useMappedState(mapStateToProps);

  const dispatch = useDispatch();

  const effectCallback = React.useCallback(
    () => {
      if (bookNames.isEmpty()) {
        if (isFetchingBooks) {
          return null;
        }

        dispatch(
          getBookNames()
        ).then(
          () => setIsFetchingBooks(false)
        );

        setIsFetchingBooks(true);
      }
    },
    [bookNames, dispatch, isFetchingBooks]
  );

  React.useEffect(
    effectCallback,
    []
  );

  const handleSelectChange = React.useCallback(
    (event) => {
      onBookSelected(event.target.value);
    },
    [onBookSelected]
  );

  return (
    <Grid container>
      <Select
        value={bookName || ""}
        onChange={handleSelectChange}
      >
        {
          bookNames.map(
            (name, index) => (
              <MenuItem
                key={index}
                value={name}
              >
                {name}
              </MenuItem>
            )
          )
        }
      </Select>
    </Grid>
  );
};

BookPicker.propTypes = {
  bookName: PropTypes.string,
  onBookSelected: PropTypes.func.isRequired,
};
