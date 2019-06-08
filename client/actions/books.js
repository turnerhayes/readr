import { createAPIAction } from "./utils";
import * as api from "+app/api";

export const getBookNames = createAPIAction(
  "getBookNames",
  async () => {
    const books = await api.getBookNames();

    return {
      books,
    };
  }
);
