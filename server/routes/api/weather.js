const express = require("express");
const qs = require("qs");
const { promisify } = require("util");
const path = require("path");
const readFile = promisify(require("fs").readFile);
const writeFile = promisify(require("fs").writeFile);
const stat = promisify(require("fs").stat);
const request = require("request-promise-native");

const Config = require("../../config");
const { Logger } = require("../../loggers");
const { ensureLoggedIn } = require("../utils");

const router = new express.Router();

const FORECAST_URI = "http://api.openweathermap.org/data/2.5/forecast";

const FORECAST_CACHE_FILE = path.join(__dirname, "forecast.json");

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

  const results = await request(
    url,
    {
      json: true,
    }
  );

  return results;
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

const fetchAndCacheForecast = async () => {
  const forecast = await fetchForecast();

  try {
    await writeFile(
      FORECAST_CACHE_FILE,
      JSON.stringify(
        forecast,
        null,
        "  "
      )
    );
  } catch (ex) {
    Logger.error({
      message: ex.message,
      stack: ex.stack,
    });
  }

  return forecast;
};

/**
 * Gets the forecast, from the cache or the API, as appropriate
 *
 * @return {Promise<object>}
 */
async function getForecast() {
  let forecastString;

  try {
    forecastString = await readFile(
      FORECAST_CACHE_FILE,
      "utf8"
    );
  } catch (ex) {
    if (ex.code === "ENOENT") {
      forecastString = await fetchAndCacheForecast();
    } else {
      throw ex;
    }
  }

  let forecast;

  const { ctime } = await stat(FORECAST_CACHE_FILE);

  // Bust the cache after 12 hours
  if (new Date() - ctime > 1000 * 60 * 60 * 12) {
    Logger.info("Forecast cache file is old; refetching");
    forecast = await fetchAndCacheForecast();
  }

  if (forecastString && !forecast) {
    forecast = JSON.parse(
      forecastString
    );

    if (forecast.error) {
      Logger.error({
        message: forecast.error.message,
      });

      return fetchAndCacheForecast();
    }
  }

  return forecast;
}

router.route("/snow-alerts")
  .get(
    ensureLoggedIn,
    async (req, res, next) => {
      try {
        const snowDays = await getSnowDays();

        res.json(snowDays);
      } catch (ex) {
        next(ex);
      }
    }
  );


module.exports = router;
