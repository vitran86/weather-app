console.log(`This file was created by Vi.`);

/* Global Variables */

// Create a new date instance dynamically with JS
let d = new Date();
let months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
let newDate = `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;

// check the input in search box is a ZipCode or an city name
const search = (searchTerm) => {
  searchTerm = searchTerm.trim();
  if (
    searchTerm.length === 5 &&
    typeof Number.parseInt(searchTerm) === "number" &&
    Number.parseInt(searchTerm) + "" === searchTerm
  ) {
    searchMethod = "zip";
  } else {
    searchMethod = "q";
  }
};

// set up function to post data to server
const postDataToServer = async (searchTerm) => {
  search(searchTerm);
  let feeling = document.getElementById("user-feeling").value;
  const result = await fetch("http://localhost:8000/addWeather", {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      method: searchMethod,
      input: searchTerm,
      mood: feeling,
    }),
  });
  if (result.status === 200) {
    const data = await result.json();
    return data;
  } else {
    throw new Error(`Unable to fetch data`);
  }
};

/* 
// set up function to get data from server --> these codes use in case we want to get all data in projectData
const getDataFromServer = async () => {
  const response = await fetch("http://localhost:8000/allData", {});
  if (response.status === 200) {
    const allData = await response.json(); // allData = projectData in server.js
    return allData;
  } else {
    throw new Error(`Unable to fetch data`);
  }
};
 */
// set up for search button
document.getElementById("search-btn").addEventListener("click", () => {
  let searchTerm = document.getElementById("search-input").value;
  //pass in search function if searchTerm is valid
  if (searchTerm) {
    search(searchTerm);
    //active the entry sections to show
    document.querySelector(".hero-box").classList.add("active");
    document.querySelector(".history-entry").classList.add("active");
    //reset value in search boxes
    document.querySelector("#search-input").value = "";
    document.querySelector("#user-feeling").value = "";
    //start to fetch data from server, then display it
    postDataToServer(searchTerm)
      .then((data) => {
        displayWeatherInfo(data);
        postEntry(data);
      })
      .catch((error) => {
        console.log(`Error: ${error}`);
      });
  }
});

// create function parse timestamp to time (use in set sunrise & sunset time)
function convertTime(timestamp) {
  const time = new Date(timestamp * 1000);
  formattedTime = time.toLocaleTimeString();
  return formattedTime;
}

// create function to convert temperature from K to F
function convertToFahrenheit(temp) {
  const tempF = ((temp - 273.15) * 9) / 5 + 32;
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
  cityEL.textContent = data.city;

  let dateEL = document.getElementById("date");
  dateEL.textContent = newDate;

  let countryEL = document.getElementById("countryCode");
  countryEL.textContent = data.country;

  let icon = data.icon;
  displayIcon(icon);
  displayBackground(icon);

  let tempEL = document.getElementById("temp");
  tempEL.textContent = convertToFahrenheit(data.temp);

  let realFeelEL = document.getElementById("feel-like");
  realFeelEL.textContent = convertToFahrenheit(data.feelLike);

  let tempMinEL = document.getElementById("temp-min");
  tempMinEL.textContent = convertToFahrenheit(data.tempMin);
  tempMinEL.style.fontWeight = 400;

  let tempMaxEL = document.getElementById("temp-max");
  tempMaxEL.textContent = convertToFahrenheit(data.tempMax);
  tempMaxEL.style.fontWeight = 400;

  let descriptionEL = document.getElementById("description");
  descriptionEL.textContent = data.description;
  descriptionEL.style.fontWeight = 400;

  let humidityEL = document.getElementById("humidity");
  humidityEL.textContent = `${data.humidity}%`;
  humidityEL.style.fontWeight = 400;

  let windSpeedEL = document.getElementById("wind-speed");
  windSpeedEL.textContent = `${data.windSpeed} mph`;
  windSpeedEL.style.fontWeight = 400;

  let sunriseEL = document.getElementById("sunrise-time");
  sunriseEL.textContent = convertTime(data.sunriseTimeStamp);
  sunriseEL.style.fontWeight = 400;

  let sunsetEL = document.getElementById("sunset-time");
  sunsetEL.textContent = convertTime(data.sunsetTimeStamp);
  sunsetEL.style.fontWeight = 400;

  let feelingEL = document.getElementById("mood");
  feelingEL.textContent = data.mood;
}

// Generate the DOM structure (looks like below) dynamically
/* 
<ul id="history-entry-item">
  <li class="history-entry-item" >
    <div class="item-title">
      <h3>Gambrills</h3>
      <p>oct 21 2020</p>
    </div>
    <div class="item-details">
      <img class="item-img" src="/static/weather-icon-png/02d.png">
      <div class="item-summary">
        <div class = "item-temp-max">79</div>
        <div class = "item-temp-min">65</div>
        <div class = "item-description">Few clouds</div>
      </div>
      <div class="item-additional-info">
        <div class="item-humidity">Humidity: 77%</div>
        <div class="item-wind">Wind speed: 3.35mph</div>
      </div>
    </div>   
  </li>
</ul>  
 */

// element.insertAdjacentHTML(position,text) ???
const postEntry = (data) => {
  const historyEntry = document.querySelector("ul#history-entry-item");
  const fragment = document.createDocumentFragment();
  const newEntry = generateNewEntry(data);
  fragment.append(newEntry);
  historyEntry.append(fragment);
  return newEntry;
};

function generateNewEntry(data) {
  const newEntry = document.createElement("li");
  newEntry.classList.add("history-entry-item");

  // Entry title
  const titleDiv = document.createElement("div");
  titleDiv.classList.add("item-title");
  const cityName = document.createElement("h3");
  cityName.innerHTML = data.city;
  titleDiv.appendChild(cityName);
  const entryDate = document.createElement("p");
  entryDate.innerHTML = newDate;
  titleDiv.appendChild(entryDate);
  newEntry.appendChild(titleDiv);

  // Entry detail
  const detailsDiv = document.createElement("div");
  detailsDiv.setAttribute("class", "item-details");
  // weather icon
  const entryImg = document.createElement("img");
  const icon = data.icon;
  entryImg.setAttribute("src", `static/weather-icon-png/${icon}.png`);
  entryImg.setAttribute("class", "item-img");
  detailsDiv.appendChild(entryImg);
  // weather summary
  const summaryDiv = document.createElement("div");
  summaryDiv.setAttribute("class", "item-summary");
  //temp max
  const tempMaxEntry = document.createElement("div");
  tempMaxEntry.classList.add("item-temp-max");
  tempMaxEntry.innerHTML = convertToFahrenheit(data.tempMax);
  summaryDiv.appendChild(tempMaxEntry);
  //temp min
  const tempMinEntry = document.createElement("div");
  tempMinEntry.classList.add("item-temp-min");
  tempMinEntry.innerHTML = convertToFahrenheit(data.tempMin);
  summaryDiv.appendChild(tempMinEntry);
  //description
  const descriptionEntry = document.createElement("div");
  descriptionEntry.classList.add("item-description");
  descriptionEntry.innerHTML = data.description;
  summaryDiv.appendChild(descriptionEntry);
  detailsDiv.appendChild(summaryDiv);

  // additional info
  const additionalInfoDiv = document.createElement("div");
  additionalInfoDiv.setAttribute("class", "item-additional-info");
  // humidity
  const humidityEntry = document.createElement("div");
  humidityEntry.classList.add("item-humidity");
  humidityEntry.innerHTML = `Humidity: ${data.humidity} %`;
  additionalInfoDiv.appendChild(humidityEntry);
  // wind speed
  const winSpeedEntry = document.createElement("div");
  winSpeedEntry.classList.add("item-wind");
  winSpeedEntry.innerHTML = `Win speed: ${data.windSpeed} mph`;
  additionalInfoDiv.appendChild(winSpeedEntry);
  detailsDiv.appendChild(additionalInfoDiv);

  newEntry.appendChild(detailsDiv);

  return newEntry;
}
