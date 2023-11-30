//variables for storing elements on the page
var leftMenu = document.getElementById("leftMenu");
var searchBox = document.getElementById("searchBox");
var searchButton = document.getElementById("searchButton");
var currentInfo = document.getElementById("currentInfo");
var weatherCardsContainer = document.getElementById("fiveDayWeather");
//variables for api key and the location/city name
var keyAPI = "bfcf3c1f54781a5d45ad618d1c8a4da9";
var city = "";
//quick is a variable that, when set to true, allows getCurrentWeather to search based on a 
//search history button press rather than text input.
var quick = false;

//function that gets the current weather of the text in the search box or the 
//value in the "city" variable
function getCurrentWeather(){
    //only want to execute a fetch if the input box contains text
    if (searchBox.value !== "" || quick){
        if (!quick){
            city = searchBox.value;
        }
        //fetch current weather using city variable and api key
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${keyAPI}&units=imperial`)
        .then(response => {
            //only call getFiveDayForecast and return response.json if response is ok
            if (response.ok){
                getFiveDayForecast();
                return response.json();
            }
            throw new Error('Something did not work.');
        })
        .then(function (data) {
            //creating new elements to put into currentInfo
            var newTitle = document.createElement('h2');
            var newTemp = document.createElement('h4');
            var newWind = document.createElement('h4');
            var newHumid = document.createElement('h4');

            //creating a border around currentInfo if search is clicked
            currentInfo.style = "border: 2px solid grey;";

            //putting data into their respective page elements
            newTitle.textContent = `${data.name}`;
            newTemp.textContent = `Temp: ${data.main.temp}`;
            newWind.textContent = `Wind: ${data.wind.speed}`;
            newHumid.textContent = `Humidity: ${data.main.humidity}`;

            //adding an icon to the title based on icon data
            newTitle.innerHTML += 
            `<img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="weather-icon">`;
            //removing all old elements and then adding newly created elements to currentInfo
            currentInfo.textContent = "";
            currentInfo.appendChild(newTitle);
            currentInfo.appendChild(newTemp);
            currentInfo.appendChild(newWind);
            currentInfo.appendChild(newHumid);
            
        })
        .catch((error) => {
            console.log(error)
        });
    }
    quick = false;
}

//function to create and display to the page the next five days of weather forecasts.
function getFiveDayForecast(){
    //clearing out any previous things in weatherCardsContainer
    weatherCardsContainer.textContent = "";
    //creating an h5 for the title and adding it to weatherCardsContainer
    var fiveTitle = document.createElement('h5');
    fiveTitle.textContent = "Five Day Forecast:";
    weatherCardsContainer.appendChild(fiveTitle);

    //fetching five day forecast from weather api using same parameters as before 
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${keyAPI}&units=imperial`)
    .then((response) => {
        if (response.ok){
            //only call addHistoryButton if response is ok
            addHistoryButton(city);
            return response.json();
        }
        //ERROR CASE: There has been an error so clear out all containers and throw an error
        currentInfo.textContent = "";
        weatherCardsContainer.textContent = "";
        throw new Error('Could not find location.');
    })
    .then(function (data) {
        const desiredTime = /09:00:00$/;
        var dataIndex = 0;
        dataList = data.list;
        //tempTime is a variable that allows me to quickly reference the last 8 characters of a 
        //date and time screen, therefore only checking for the time of day.
        tempTime = data.list[dataIndex].dt_txt.slice(-8);

        //creating, filling, and then adding the cards to the screen with the corresponding information
        for (i=0;i<5;i++){  
            //looking for the next item in data that contains the time 09:00:00 
            //The code will move on once it has found the dataIndex of this item.
            while (dataIndex < data.list.length && !(desiredTime.test(tempTime))){
                dataIndex++;
                tempTime = data.list[dataIndex].dt_txt.slice(-8);
            }
            tempDataItem = dataList[dataIndex];
            //using createWeatherCard to create a weather card element that can be appended to the page
            weatherCardsContainer.appendChild(createWeatherCard
                (formatDate(tempDataItem.dt_txt.substring(0,10)),tempDataItem.weather[0].icon,tempDataItem.main.temp,
                tempDataItem.wind.speed,tempDataItem.main.humidity));
            dataIndex++;
            tempTime = data.list[dataIndex].dt_txt.slice(-8);
        }
    })
    .catch((error) => {
        //actually displaying the error message in the weatherCardsContainer
        userErrorMessage = document.createElement('h2');
        userErrorMessage.textContent = error;
        weatherCardsContainer.appendChild(userErrorMessage);
    });
}

//creates a weather card based on parameters passed to it
function createWeatherCard(date, icon, temp, wind, humid){
    var tempCard = document.createElement('div');
    tempCard.className = "card";
    tempCard.style = "display: inline-block;";
    tempCard.innerHTML = 
    `<div class="card-header">
        ${date} <img src="https://openweathermap.org/img/wn/${icon}.png" alt="weather-icon">
    </div>
    <ul id = "cardItems" class="list-group list-group-flush">
    <li class="list-group-item">Temp: ${temp}</li>
    <li class="list-group-item">Wind: ${wind}</li>
    <li class="list-group-item">Humidity: ${humid}</li>
    </ul>`;
    return tempCard;
}
//function used to rearrange the date received by the weather API  
//into a more readable format
function formatDate(date){
    newDate = "";
    day = "";
    month = "";
    year = "";
    year = date.substring(0,4);
    month = date.substring(5,7);
    day = date.substring(8,10);
    return `${month}/${day}/${year}`;
}
//function to add a search history button IF the city searched doesn't already have
//a button AND if there is less than or equal to 10 history buttons
function addHistoryButton(cityName){
    alreadyInHistory = false;
    hButtonCount = 0;
    //goes through all found history items from localStorage and finds if the city
    //already has a button. Also counts the items it finds
    for (i=0; i<localStorage.length;i++){
        var key = localStorage.key(i);
        if (key !== null && key.includes("weatherSearch")){
            if (key.substring(13).toLowerCase() === cityName.toLowerCase()){
                alreadyInHistory = true;
            }
            hButtonCount++;
        }
    }

    //if not already in history AND there are less than 10 buttons in existence
    if (!alreadyInHistory && hButtonCount < 10){
        properCityName = cityName.charAt(0).toUpperCase() + cityName.slice(1);
        localStorage.setItem(`weatherSearch${properCityName}`, " ");
        var greyButton = document.createElement('a');
        greyButton.className = "btn btn-secondary";
        greyButton.innerHTML = properCityName;
        leftMenu.appendChild(greyButton);
    }
}
//loads the search history items from localStorage, turns them into 
//buttons and adds them to the page.
function loadHistory(){
    for (i=0;i<localStorage.length;i++){
        var key = localStorage.key(i);
        if (key !== null && key.includes("weatherSearch")){
            var greyButton = document.createElement('a');
            greyButton.className = "btn btn-secondary";
            greyButton.onclick = quickSearch;
            greyButton.innerHTML = key.substring(13);
            leftMenu.appendChild(greyButton);
        }
    }
}
//function created to make the search history buttons actually "search"
//based on the values contained inside of them. It most importantly sets the quick
//variable to true so that it can bypass the first if statement in getCurrentWeather()
function quickSearch(){
    quick = true;
    city = this.innerHTML;
    getCurrentWeather();
}

searchButton.addEventListener("click", getCurrentWeather);
