const latLngString = process.env.FIEF_PROPERTY_LOCATION;

let location;

if (latLngString) {
  let [lat, lng] = latLngString.split(/\s*,\s*/);

  lat = Number(lat);
  lng = Number(lng);

  if (
    isNaN(lat) ||
    isNaN(lng)
  ) {
    throw new Error(`Invalid property location: ${latLngString}`);
  }

  location = [lat, lng];
}

const PropertyConfig = {
  location,
};

module.exports = PropertyConfig;
