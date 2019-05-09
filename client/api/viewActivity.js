import { fromJS } from "immutable";

export const getNewActivity = async () => {
  const response = await fetch(
    "/api/activity/issues",
    {
      method: "GET",
      headers: {
        "Accept": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Error getting new issue activity");
  }

  if (response.status < 300) {
    const results = await response.json();

    return fromJS(results);
  }

  throw new Error(
    `GET Request to /api/activity/issues returned with status ${
      response.status
    }`
  );
};


export const markIssueSeen = async ({ id, includeComments }) => {
  let url = `/api/activity/issues/${id}`;

  if (includeComments) {
    url += "?includeComments=1";
  }

  const response = await fetch(
    url,
    {
      method: "PUT",
      headers: {
        "Accept": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Error setting issue seen");
  }

  if (response.status < 300) {
    const results = await response.json();

    return fromJS(results);
  }

  throw new Error(
    `PUT Request to ${url} returned with status ${
      response.status
    }`
  );
};
