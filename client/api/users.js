import { fromJS, Map } from "immutable";

const userArrayToMap = (userArray) => {
  return Map().withMutations(
    (userMap) => {
      for (const user of userArray) {
        userMap.set(
          user.id,
          fromJS(user)
        );
      }
    }
  );
};

export const getUsers = async ({ ids }) => {
  let url = "/api/users";

  const qs = new URLSearchParams();

  if (ids && ids.length > 0) {
    for (const id of ids) {
      qs.append("ids", id);
    }
  }

  url += `?${qs}`;

  const response = await fetch(
    url,
    {
      headers: {
        "Accept": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Error getting users");
  }

  if (response.status < 300) {
    const json = await response.json();

    return userArrayToMap(json);
  }

  throw new Error(
    `GET Request to /api/users returned with status ${response.status}`
  );
};
