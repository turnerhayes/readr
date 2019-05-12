const qs = require("qs");
const request = require("request-promise-native");

const Config = require("../../config");
const { Logger } = require("../../loggers");

const redisClient = require("../redisClient");

const FORECAST_URI = "http://api.openweathermap.org/data/2.5/forecast";

/**
 * Fetches the forecast from the weather API
 *
 * @return {Promise<object>} the forecast object
 */
async function fetchForecast() {
  const [lat, lon] = Config.property.location;

  const url = `${FORECAST_URI}?${
    qs.stringify({
      APPID: Config.weather.openWeatherMapAPIKey,
      lat,
      lon,
      units: "imperial",
    })
  }`;

  Logger.info("Fetching forecast from API endpoint");

  const results = await request(
    url,
    {
      json: true,
    }
  );

  return results;
}

const fetchAndCacheForecast = async () => {
  const forecast = await fetchForecast();

  if (redisClient) {
    try {
      await redisClient.set(
        "weather:forecast",
        JSON.stringify(forecast),
        // Expires in 12 hours
        "EX",
        60 * 60 * 12
      );
    } catch (ex) {
      Logger.error({
        message: ex.message,
        stack: ex.stack,
      });
    }
  }

  return forecast;
};

/**
 * Gets the forecast, from the cache or the API, as appropriate
 *
 * @return {Promise<object>}
 */
async function getForecast() {
  let forecast;
  let forecastString;

  if (redisClient) {
    forecastString = await redisClient.get(
      "weather:forecast"
    );
  }

  if (forecastString) {
    forecast = JSON.parse(forecastString);
  } else {
    forecast = await fetchAndCacheForecast();
  }

  return forecast;
}


const getSnowDays = async () => {
  const forecast = await getForecast();

  const snowDays = {};

  forecast.list.forEach(
    (forecast) => {
      if (forecast.snow) {
        // Convert from unix timestamp (seconds) to JS timestamp (ms)
        const day = new Date(forecast.dt * 1000);
        // Normalize to date-level specificity
        day.setHours(0);
        day.setMinutes(0);
        day.setSeconds(0);
        day.setMilliseconds(0);

        // Accumulate daily snow totals
        snowDays[day.getTime()] = (snowDays[day.getTime()] || 0) +
          forecast.snow["3h"];
      }
    }
  );

  if (Object.keys(snowDays).length === 0) {
    return null;
  }

  return snowDays;
};


module.exports = {
  getSnowDays,
};
