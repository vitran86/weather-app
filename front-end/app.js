console.log(`This file was created by Vi.`);

let serverURL = "";

if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
  serverURL = "http://localhost:8000";
}

document.addEventListener("DOMContentLoaded", function () {
  // set up for search button
  document.getElementById("add-btn").addEventListener("click", () => {
    let arrCity = document.getElementById("arr-city-name").value.trim();
    let depCity = document.getElementById("dep-city-name").value.trim();

    console.log(depCity, arrCity);

    //active the entry sections to show & post data
    document.querySelector(".hero-box").classList.add("active");
    //start to fetch data from server, then display it
    postDataToServer(depCity, arrCity)
      .then((data) => {
        displayWeatherInfo(data); // ref. app-function.js
        generateWeatherForecast(data);
        //reset value in search boxes
        document.querySelector("#departure-date").value = "";
        document.querySelector("#arrival-date").value = "";
        document.querySelector("#dep-city-name").value = "";
        document.querySelector("#arr-city-name").value = "";
      })
      .catch((error) => {
        console.log(`Error: ${error}`);
      });
  });

  // set up function to post data to server
  const postDataToServer = async (depCity, arrCity) => {
    /* let feeling = document.getElementById("user-feeling").value; */
    const result = await fetch(`${serverURL}/addWeather`, {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        // "Content-Type": "text/plain",
      },
      body: JSON.stringify({
        depCity: depCity,
        arrCity: arrCity,
      }),
    });
    if (result.status === 200) {
      const data = await result.json();
      console.log(data);
      return data;
    } else {
      throw new Error(`Unable to fetch data`);
    }
  };

  // set up function to post data
  const postEntry = (data) => {
    const historyEntry = document.querySelector("ul#history-entry-item");
    const fragment = document.createDocumentFragment();
    const newEntry = generateNewEntry(data); // ref. app-function.js
    fragment.append(newEntry);
    historyEntry.append(fragment);
    return newEntry;
  };
});
