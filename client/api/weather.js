import { OrderedMap } from "immutable";

export const getSnowAlerts = async () => {
  const url = "/api/weather/snow-alerts";

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

    if (json) {
      return OrderedMap().withMutations(
        (map) => Object.keys(json).sort(
          (a, b) => Number(a) - Number(b)
        ).forEach(
          (timestamp) => map.set(
            new Date(Number(timestamp)),
            json[timestamp]
          )
        )
      );
    }

    return null;
  }

  throw new Error(
    `GET Request to ${url} returned with status ${response.status}`
  );
};
