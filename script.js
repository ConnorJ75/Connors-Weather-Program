//Note: to use the api, you need to get rid of the squigly brackets in order to use the apID
//one working url looks like 
//https://api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=bfcf3c1f54781a5d45ad618d1c8a4da9
var searchBox = document.getElementById("searchBox");
var searchButton = document.getElementById("searchButton");
var currentInfo = document.getElementById("currentInfo");
var weatherCardsContainer = document.getElementById("fiveDayWeather");
var keyAPI = "bfcf3c1f54781a5d45ad618d1c8a4da9";
var city;

function getCurrentWeather(){
    if (searchBox.value !== ""){
        city = searchBox.value;
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${keyAPI}&units=imperial`)
        .then((response) => {
            if (response.ok){
                return response.json();
            }
            throw new Error('Something did not work.');
        })
        .then(function (data) {
            //creating new elements to put into currentInfo
            var newTitle = document.createElement('h4');
            var newTemp = document.createElement('h6');
            var newWind = document.createElement('h6');
            var newHumid = document.createElement('h6');

            //creating a border around currentInfo if search is clicked
            currentInfo.style = "border: 2px solid grey;";

            //putting data into their respective places
            newTitle.textContent = `${data.name} // (Icon): ${data.weather[0].main}`;
            newTemp.textContent = `Temp: ${data.main.temp}`;
            newWind.textContent = `Wind: ${data.wind.speed}`;
            newHumid.textContent = `Humidity: ${data.main.humidity}`;

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
        getFiveDayForecast();
    }
    
}

function getFiveDayForecast(){
    var cards = [];

    //clearing out any previous things in fiveDayWeather/weatherCardsContainer
    weatherCardsContainer.textContent = "";
    //creating an h5 for the title and adding it to fiveDayWeather
    var fiveTitle = document.createElement('h5');
    fiveTitle.textContent = "Five Day Forecast:";
    weatherCardsContainer.appendChild(fiveTitle);

    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${keyAPI}&units=imperial`)
    .then((response) => {
        if (response.ok){
            return response.json();
        }
        throw new Error('Could not find location.');
    })
    .then(function (data) {
        const desiredTime = /09:00:00$/;
        var dataIndex = 0;
        dataList = data.list;
        tempTime = data.list[dataIndex].dt_txt.slice(-8);

        //creating, filling, and then adding the cards to the screen with the correct information
        for (i=0;i<5;i++){  
            //looking for the next item in data that contains the time 9:00 AM. 
            //The code will move on once it has found the dataIndex of this item.
            while (dataIndex < data.list.length && !(desiredTime.test(tempTime))){
                dataIndex++;
                tempTime = data.list[dataIndex].dt_txt.slice(-8);
            }
            tempDataItem = dataList[dataIndex];
            weatherCardsContainer.appendChild(createWeatherCard
                (formatDate(tempDataItem.dt_txt.substring(0,10)),"--",tempDataItem.main.temp,tempDataItem.wind.speed,tempDataItem.main.humidity));
            dataIndex++;
            tempTime = data.list[dataIndex].dt_txt.slice(-8);
        }
    })
    .catch((error) => {
        weatherCardsContainer.textContent = error;
    });

    
}

//creates a weather card based on parameters passed to it
function createWeatherCard(date, icon, temp, wind, humid){
    var tempCard = document.createElement('div');
    tempCard.className = "card";
    tempCard.style = "display: inline-block;";
    tempCard.innerHTML = 
    `<div class="card-header">
        ${date} ${icon}
    </div>
    <ul class="list-group list-group-flush">
    <li class="list-group-item">Temp: ${temp}</li>
    <li class="list-group-item">Wind: ${wind}</li>
    <li class="list-group-item">Humidity: ${humid}</li>
    </ul>`;
    return tempCard;
}

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

searchButton.addEventListener("click", getCurrentWeather);
