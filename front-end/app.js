console.log(`This file was created by Vi.`);

let serverURL = "";

if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
  serverURL = "http://localhost:8000";
} else {
  serverURL = "https://afternoon-peak-58665.herokuapp.com";
}

document.addEventListener("DOMContentLoaded", function () {
  // set up for search button
  document.getElementById("search-btn").addEventListener("click", () => {
    let searchTerm = document.getElementById("search-input").value;
    //pass in search function if searchTerm is valid
    if (searchTerm) {
      search(searchTerm);
      //active the entry sections to show & post data
      document.querySelector(".hero-box").classList.add("active");
      document.querySelector(".history-entry").classList.add("active");
      //start to fetch data from server, then display it
      postDataToServer(searchTerm)
        .then((data) => {
          displayWeatherInfo(data); // ref. app-function.js
          postEntry(data);
          //reset value in search boxes
          document.querySelector("#search-input").value = "";
          document.querySelector("#user-feeling").value = "";
        })
        .catch((error) => {
          console.log(`Error: ${error}`);
        });
    }
  });

  // set up function to post data to server
  const postDataToServer = async (searchTerm) => {
    search(searchTerm);
    let feeling = document.getElementById("user-feeling").value;
    const result = await fetch(`${serverURL}/addWeather`, {
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
const response = await fetch(`${serverURL}/allData`, {});
if (response.status === 200) {
  const allData = await response.json(); // allData = projectData in server.js
  return allData;
} else {
  throw new Error(`Unable to fetch data`);
}
};
*/

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
