const weatherApiUrl = "https://api.openweathermap.org";
const weatherApiKey = "e695bffb7ce578edbbd2bff7c6c3b6bc";
let searchHistory = [];
let searchInput = document.querySelector("#search-input");
let searchForm = document.querySelector("#search-form");
let searchHistoryContainer = document.querySelector("#history");
let forecastContainer = document.querySelector("#forecast");
let todayContainer = document.querySelector("#today");

//rendering forecast weather data history
function renderSearchHistory() {
    searchHistoryContainer.innerHTML = "";
    
    // Loop through searchHistory array and create a button for each item
    searchHistory.forEach(function(searchItem) {
      let btn = document.createElement("button");
      btn.type = "button";
      btn.classList.add("history-btn", "btn-history");
      btn.setAttribute("data-search", searchItem);
      btn.textContent = searchItem;
      searchHistoryContainer.appendChild(btn);
      
      // Attach click event listener to button
      btn.addEventListener("click", function() {
        searchInput.value = searchItem;
        getWeatherData(searchItem);
      });
    });
  }
  
      

  //local storage to store user search history for future use

function appendSearchHistory(search) {
  if (searchHistory.indexOf(search) !== -1) {
    return;
  }
  searchHistory.push(search);
  localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
  renderSearchHistory();
}

//forecast weather data for a searched city
function renderCurrentWeather(city, weatherData) {
  let date = moment().format("D/M/YYYY");
  let tempC = weatherData.main.temp;
  let windKph = weatherData.wind.speed;
  let humidity = weatherData.main.humidity;

  let iconUrl = `https://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`;
  let iconDescription = weatherData.weather[0].description || weatherData.weather[0].main;
  console.log(weatherData);

  let card = document.createElement("div");
  let cardBody = document.createElement("div");
  let heading = document.createElement("h2");
  let tempEl = document.createElement("p");
  let windEl = document.createElement("p");
  let humidityEl = document.createElement("p");
  let weatherIcon = document.createElement("img");

  card.classList.add("card");
  cardBody.classList.add("card-body");
  heading.classList.add("h3", "card-title");
  tempEl.classList.add("card-text");
  windEl.classList.add("card-text");
  humidityEl.classList.add("card-text");

  heading.textContent = `${city} (${date})`;
  weatherIcon.src = iconUrl;
  weatherIcon.alt = iconDescription;

  heading.appendChild(weatherIcon);
  tempEl.textContent = `Temp: ${tempC} C`;
  windEl.textContent = `Wind: ${windKph} KPH`;
  humidityEl.textContent = `Humidity: ${humidity} %`;
  cardBody.append(heading, tempEl, windEl, humidityEl);
  card.append(cardBody);

  todayContainer.innerHTML = "";
  todayContainer.append(card);
}

function renderForecast(weatherData){
  console.log("weatherData:");
  console.log(weatherData);

  let headingCol = document.createElement("div");
  let heading = document.createElement("h4");

  headingCol.classList.add("col-12");
  heading.textContent = "5-day forecast";
  headingCol.appendChild(heading);
  forecastContainer.innerHTML = "";
  forecastContainer.appendChild(headingCol);

  //function passed to filter() checks if the dt_txt property of each element includes the string "12"
  
  let futureForecast = weatherData.filter(function (forecast) {
    return forecast.dt_txt.includes("12");
  });

  console.log(futureForecast);

  for (let i = 0; i < futureForecast.length; i++) {
    let iconUrl = `https://openweathermap.org/img/w/${futureForecast[i].weather[0].icon}.png`;
    console.log(iconUrl);
    let iconDescription = futureForecast[i].weather[0].description;
    console.log(iconDescription);
    let tempC = futureForecast[i].main.temp;
    let humidity = futureForecast[i].main.humidity;
    let windKph = futureForecast[i].wind.speed;
  
    let col = document.createElement("div");
    let card = document.createElement("div");
    let cardBody = document.createElement("div");
    let cardTitle = document.createElement("h5");
    let weatherIcon = document.createElement("img");
    let tempEl = document.createElement("p");
    let windEl = document.createElement("p");
    let humidityEl = document.createElement("p");
  
    col.appendChild(card);
    card.appendChild(cardBody);
    cardBody.appendChild(cardTitle);
    cardBody.appendChild(weatherIcon);
    cardBody.appendChild(tempEl);
    cardBody.appendChild(windEl);
    cardBody.appendChild(humidityEl);
  
    col.setAttribute("class", "col-md");
    card.setAttribute("class", "card bg-primary h-100 text-white");
    cardTitle.setAttribute("class", "card-title");
    tempEl.setAttribute("class", "card-text");
    windEl.setAttribute("class", "card-text");
    humidityEl.setAttribute("class", "card-text");
  
    cardTitle.textContent = moment(futureForecast[i].dt_text).format("D/M/YYYY");
    weatherIcon.setAttribute("src", iconUrl);
    weatherIcon.setAttribute("alt", iconDescription);
    tempEl.textContent = `Temp: ${tempC} C`;
    windEl.textContent = `Wind: ${windKph} KPH`;
    humidityEl.textContent = `Humidity: ${humidity} %`;
  
    forecastContainer.appendChild(col);
  }
}

function fetchWeather(location) {
    const latitude = location.lat;
    const longitude = location.lon;
    const city = location.name;
  
    const queryWeatherUrl = `${weatherApiUrl}/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${weatherApiKey}`;
  
    console.log(queryWeatherUrl);
  //API calls to OpenWeatherMap
    fetch(queryWeatherUrl, { method: 'GET' })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        renderCurrentWeather(city, data.list[0]);
        renderForecast(data.list);
      })
      .catch(function (error) {
        console.error(error);
      });
  }
  //fetchCoord that takes a search string as an argument. The search string is used to query the OpenWeatherMap API
  function fetchCoord(search) {
    const queryUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${search}&limit=5&appid=${weatherApiKey}`;
  
    fetch(queryUrl, { method: 'GET' })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data);
        if (!data[0]) {
          alert('Location not found!');
        } else {
        //appendSearchHistory function with the search argument to add the search term to the search history list
          appendSearchHistory(search);
          fetchWeather(data[0]);
        }
      })
      .catch(function (error) {
        console.error(error);
      });
  }
  
  function initializeHistory() {
    const storedHistory = localStorage.getItem('search-history');
  
    if (storedHistory) {
      searchHistory = JSON.parse(storedHistory);
    }
  
    renderSearchHistory();
  }
  
 // Define subitSearchFrom function
  function submitSearchForm(event) {
    event.preventDefault();
    const search = searchInput.value.trim();
  
    fetchCoord(search);
    searchInput.value = '';
  }
  

  // Define clickSearchHistory function
  function clickSearchHistory(event) {
    if (!event.target.classList.contains('btn-history')) {
      return;
    }
  
    const search = event.target.getAttribute('data-search');
    fetchCoord(search);
    searchInput.value = '';
  }
  

  
  initializeHistory();
 
  searchForm.addEventListener('submit', submitSearchForm);
  searchHistory.addEventListener('click', clickSearchHistory);

  