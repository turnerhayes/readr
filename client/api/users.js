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
  const response = await fetch(
    "/api/users",
    {
      body: JSON.stringify({
        ids,
      }),
      headers: {
        "Accept": "application/json",
        "Content-type": "application/json",
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
