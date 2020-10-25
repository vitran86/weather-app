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
const baseURL = "http://api.openweathermap.org/data/2.5/weather?";
const APIKey = "cffa78ab6cd6321ddb765247acf7eb58";
const unit = "imperial"; // imperial : F, metric :C, standard (by default) : K

app.post("/addWeather", async (req, res) => {
  // fetch data from baseURL for the request
  let method = req.body.method;
  let input = req.body.input;

  const response = await fetch(
    `${baseURL}${method}=${input}&appid=${APIKey}&unit=${unit}`,
    {}
  );
  if (response.status === 200) {
    const data = await response.json();

    let mood = req.body.mood;
    let city = data.name;
    let country = data.sys.country;
    let icon = data.weather[0].icon;
    let temp = data.main.temp;
    let feelLike = data.main.feels_like;
    let tempMin = data.main.temp_min;
    let tempMax = data.main.temp_max;
    let description = data.weather[0].description;
    let humidity = data.main.humidity;
    let windSpeed = data.wind.speed;
    let sunriseTimeStamp = data.sys.sunrise;
    let sunsetTimeStamp = data.sys.sunset;

    const weatherData = {
      mood: mood,
      city: city,
      country: country,
      icon: icon,
      temp: temp,
      feelLike: feelLike,
      tempMin: tempMin,
      tempMax: tempMax,
      description: description,
      humidity: humidity,
      windSpeed: windSpeed,
      sunriseTimeStamp: sunriseTimeStamp,
      sunsetTimeStamp: sunsetTimeStamp,
    };
    projectData.push(weatherData);

    console.log(weatherData); // expected print out an object which has format as above --> yes

    res.send(weatherData);
  } else {
    throw new Error(`Unable to fetch data`);
  }

  try {
    console.log(projectData); // expected print out an array of weatherData objects --> yes
    console.log(req.body); // expected print out { method :"zip"/"q", input : "searchTerm", mood: "mood" } --> yes
  } catch (error) {
    console.log("error", error);
  }
});
