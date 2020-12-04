// Create a new date instance dynamically with JS
function takeDate(input) {
  let d = new Date(input);
  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return (newDate = `${months[d.getMonth()]} ${
    d.getDate() + 1
  }, ${d.getFullYear()}`);
}

// create function parse timestamp to time (use in set sunrise & sunset time)
function convertTime(timestamp) {
  const time = new Date(timestamp * 1000);
  formattedTime = time.toLocaleTimeString();
  return formattedTime;
}

// create function to convert temperature from K to F
function convertToFahrenheit(tempC) {
  const tempF = tempC * 1.8 + 32;
  return `${Math.round(tempF)} °F`;
}

// create function to get weather icon & background dynamically
function displayIcon(icon) {
  let weatherIcon = document.getElementById("weather-icon");
  let weatherImg = document.createElement("img");
  weatherImg.setAttribute("src", `static/weather-icon-png/${icon}.png`);
  weatherImg.setAttribute("id", "weather-img");
  weatherImg.style.height = 100;
  weatherIcon.innerHTML = "";
  weatherIcon.appendChild(weatherImg);
}
function displayBackground(icon) {
  let background = document.getElementById("background-container");
  let backgroundImg = document.createElement("img");
  backgroundImg.setAttribute("src", `static/pic/${icon}.jpg`);
  backgroundImg.setAttribute("id", "background-app");
  background.innerHTML = "";
  background.appendChild(backgroundImg);
}

// create function to update UI
function displayWeatherInfo(data) {
  let cityEL = document.getElementById("city");
  cityEL.textContent = `Trip to: ${data[0].cityName}`;

  let countryEL = document.getElementById("countryName");
  countryEL.textContent = data[0].countryName;

  let dateStartEL = document.getElementById("start-date");
  const departDate = document.querySelector("#departure-date").value;
  dateStartEL.textContent = `Departing: ${takeDate(departDate)}`;

  let dateEndEL = document.getElementById("end-date");
  const arrivalDate = document.querySelector("#arrival-date").value;
  dateEndEL.textContent = `Arrival: ${takeDate(arrivalDate)}`;

  let imgEL = document.getElementById("city-pic");
  imgEL.setAttribute("src", `${data[2].pic}`);
  imgEL.setAttribute("alt", `${data[0].cityName}`);

  let tripEL = document.getElementById("tripName");
  tripEL.textContent = data[0].cityName;

  let daysLeftEL = document.getElementById("calc-day");
  daysLeftEL.textContent = "120";

  data[1].forEach((objectData) => {
    const weatherForecast = document.querySelector("#weather");
    const weatherObject = generateWeatherForecast(objectData);
    weatherForecast.appendChild(weatherObject);
  });
}

// create function to generate waether forecast (structure looks like below) dynamically
/* 
<div class="weather-forecast">
  <h3>Weather forecast in next 16 days</h3>
  <ul id="weather">
    <li class=weather-items>
      <div class="forecast-date">Dec 24,2020</div>
      <div><img class="forecast-icon" src="/static/weather-icon-png/a01d.png" width="50" height="50"></div>
      <div class="forecast-minTemp">L: 7 C</div>
      <div class="forecast-maxTemp">H: 17 C</div>
      <div class="forecart-description">broken cloudy</div>
    </li>
  </ul>
</div>
 */

function generateWeatherForecast(data) {
  const newForecast = document.createElement("li");
  newForecast.classList.add("weather-items");

  //forecast date
  const forecastDate = document.createElement("div");
  forecastDate.classList.add("forecast-date");
  forecastDate.innerHTML = takeDate(data.forecastDate);
  newForecast.appendChild(forecastDate);

  // weather icon
  const iconContainer = document.createElement("div");
  const weatherIcon = document.createElement("img");
  const icon = data.icon;
  weatherIcon.setAttribute("src", `static/weather-icon-png/${icon}.png`);
  weatherIcon.setAttribute("class", "forecast-icon");
  iconContainer.appendChild(weatherIcon);
  newForecast.appendChild(iconContainer);

  //temp min
  const tempMin = document.createElement("div");
  tempMin.classList.add("forecast-minTemp");
  tempMin.innerHTML = `L: ${convertToFahrenheit(data.minTemp)}`;
  newForecast.appendChild(tempMin);

  //temp max
  const tempMax = document.createElement("div");
  tempMax.classList.add("forecast-maxTemp");
  tempMax.innerHTML = `H: ${convertToFahrenheit(data.maxTemp)}`;
  newForecast.appendChild(tempMax);

  //description
  const description = document.createElement("div");
  description.classList.add("forecart-description");
  description.innerHTML = data.description;
  newForecast.appendChild(description);

  return newForecast;
}
