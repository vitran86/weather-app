console.log(`hello Vi`);
// Setup empty JS object to act as endpoint for all routes
projectData = [];

// Require Express to run server and routes
const express = require("express");

// Require Node-fetch to run server
const fetch = require("node-fetch");

// Require moment to convert date & time
const moment = require("moment");

// Start up an instance of app
const app = express();

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require("cors");
const e = require("express");
const { response } = require("express");
app.use(cors());

// Initialize the main project folder
app.use(express.static("font-end"));

// Setup Server
const port = process.env.PORT || 8000;
const server = app.listen(port, listening);

function listening() {
  console.log(`This app is running on localhost:${port}`);
}

// Set up Routers

// GET route:

app.get("/allData", async (req, res) => {
  res.send(projectData);
});

// POST route:

app.post("/addWeather", async (req, res) => {
  // fetch data from baseURL for the request

  let depCity = req.body.depCity;
  let arrCity = req.body.arrCity;

  const consolidatedData = [];

  const geoArrData = await getGeoData(arrCity);
  const geoDepData = await getGeoData(depCity);
  consolidatedData.push({
    arrCityName: geoArrData.cityName,
    arrCountryName: geoArrData.countryName,
    arrCountryCode: geoArrData.countryCode,
    depCityName: geoDepData.cityName,
    depCountryName: geoDepData.countryName,
    depCountryCode: geoDepData.countryCode,
  });

  const weatherData = await getWeather(geoArrData.lat, geoArrData.lng);
  consolidatedData.push(weatherData);

  const picture = await getPicture(geoArrData.cityName);
  consolidatedData.push({ pic: picture });

  const countryInfo = await getCountryInfo(geoArrData.countryCode);
  consolidatedData.push({ countryInfo });

  const covid19 = await getCovidInfo(geoArrData.countryCode);
  consolidatedData.push({ covid19 });

  const arrivalCode = await getCityCode(
    geoArrData.cityName,
    geoArrData.countryCode
  );

  const departureCode = await getCityCode(
    geoDepData.cityName,
    geoDepData.countryCode
  );
  consolidatedData.push({
    departureCode: departureCode,
    arrivalCode: arrivalCode,
  });

  const airportCodeByCity = await getAirportCodeByCity(geoArrData.cityName);
  consolidatedData.push({ airportCodeByCity });

  const flightInfo = await getFlightInfo(airportCodeByCity.code);
  consolidatedData.push(flightInfo);

  res.send(consolidatedData);

  try {
    /* console.log(countryInfo); */

    console.log(req.body);
  } catch (error) {
    console.log("error", error);
  }
});

async function getGeoData(city) {
  const geoURL = "http://api.geonames.org/searchJSON?";
  const userName = "TTTV";

  const response1 = await fetch(
    `${geoURL}q=${city}&maxRows=1&username=${userName}`,
    {}
  );
  if (response1.status === 200) {
    const data = await response1.json();

    const geo = {
      lat: data.geonames[0].lat,
      lng: data.geonames[0].lng,
      cityName: data.geonames[0].toponymName,
      countryName: data.geonames[0].countryName,
      countryCode: data.geonames[0].countryCode,
    };
    return geo;
  } else {
    throw new Error(`Unable to fetch data`);
  }
}

async function getWeather(lat, lon) {
  const weatherbitURL = "http://api.weatherbit.io/v2.0/forecast/daily?";
  const weatherbitKey = "ae857db3ebc5475bb1009332ddfea23f";

  const response2 = await fetch(
    `${weatherbitURL}&lat=${lat}&lon=${lon}&key=${weatherbitKey}`,
    {}
  );

  const weatherForecast = [];

  if (response2.status === 200) {
    const weatherData = await response2.json();
    weatherData.data.forEach((objectData) => {
      weatherForecast.push({
        forecastDate: objectData.valid_date,
        maxTemp: objectData.max_temp,
        minTemp: objectData.min_temp,
        description: objectData.weather.description,
        icon: objectData.weather.icon,
      });
    });

    return weatherForecast;
  } else {
    throw new Error(`Unable to fetch data`);
  }
}

async function getPicture(cityName) {
  const pixabayURL = "https://pixabay.com/api/?";
  const pixabayKey = "19320239-263c2713cda44540f58430950";

  const response3 = await fetch(
    `${pixabayURL}&q=${encodeURI(
      cityName
    )}&image_type=photo&orientation=horizontal&safesearch=true&key=${pixabayKey}`,
    {}
  );
  if (response3.status === 200) {
    const data = await response3.json();
    const picture = data.hits[0].webformatURL;
    return picture;
  } else {
    throw new Error(`Unable to fetch data`);
  }
}

async function getCountryInfo(countryCode) {
  const restCountryURL = "https://restcountries.eu/rest/v2/alpha/";

  const response4 = await fetch(`${restCountryURL}${countryCode}`, {});

  const arrCountryInfo = [];
  if (response4.status === 200) {
    const data = await response4.json();

    arrCountryInfo.push({
      area: data.area,
      capital: data.capital,
      population: data.population,
      currencyCode: data.currencies[0].code,
      currencyName: data.currencies[0].name,
      languageName: data.languages[0].name,
    });

    return arrCountryInfo;
  } else {
    throw new Error(`Unable to fetch data`);
  }
}

async function getCovidInfo(countryCode) {
  const covid19URL = "https://covid19-api.org/api/status/";

  const response5 = await fetch(`${covid19URL}${countryCode}`, {});
  if (response5.status === 200) {
    const data = await response5.json();
    return data;
  } else {
    throw new Error(`Unable to fetch data`);
  }
}

async function getFlightInfo(airportCode) {
  const fightURL =
    "http://api.aviationstack.com/v1/flights?flight_status=scheduled";
  const aviationKey = "4e9291f836df4edb71c168778f5b663c";

  const response6 = await fetch(
    `${fightURL}&arr_iata=${airportCode}&access_key=${aviationKey}`,
    {}
  );
  if (response6.status === 200) {
    const data = await response6.json();
    const flightData = [];

    data.data.forEach((objectData) => {
      flightData.push({
        depIATA: objectData.departure.iata,
        airline: objectData.airline.name,
        flight: objectData.flight.iata,
        scheduledTime: objectData.departure.scheduled,
      });
    });
    console.log(data);
    console.log(flightData);
    return flightData;
  } else {
    throw new Error(`Unable to fetch data`);
  }
}

async function getCityCode(cityName, countryCode) {
  const airlabURL = "http://airlabs.co/api/v6/cities?";
  const airlabKey = "48286b4a-3e14-47de-b4e3-d43a87388ea5";

  const response = await fetch(`${airlabURL}&api_key=${airlabKey}`, {});
  if (response.status === 200) {
    const data = await response.json();
    /* return data; */

    const cityCode = data.response.filter((objectData) => {
      const city = objectData.name;
      const country = objectData.country_code;
      const code = objectData.code;
      if (
        (city === cityName ||
          city.includes(cityName) ||
          cityName.startsWith(city)) &
        (country === countryCode)
      ) {
        return code;
      }
    });
    return cityCode;
  } else {
    throw new Error(`Unable to fetch data`);
  }
}

async function getAirportCodeByCity(arrCityName) {
  const airlabURL = "http://airlabs.co/api/v6/autocomplete?";
  const airlabKey = "48286b4a-3e14-47de-b4e3-d43a87388ea5";
  const response = await fetch(
    `${airlabURL}query=${encodeURI(arrCityName)}&api_key=${airlabKey}`,
    {}
  );
  if (response.status === 200) {
    const data = await response.json();

    const airportCodeByCity = data.response.airports_by_cities[0];
    return airportCodeByCity;
  } else {
    throw new Error(`Unable to fetch data`);
  }
}
