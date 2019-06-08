import { OrderedMap, Map } from "immutable";

import {
  getBookNames,
} from "+app/actions";

export const BooksReducer = (state = OrderedMap(), action) => {
  switch (action.type) {
    case getBookNames.actionTypes.complete: {
      const { books } = action.payload;

      return state.withMutations(
        (mutable) => books.forEach(
          (bookName) => {
            if (!mutable.has(bookName)) {
              mutable.set(bookName, Map());
            }
          }
        )
      );
    }

    default: {
      return state;
    }
  }
};
