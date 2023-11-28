//Note: to use the api, you need to get rid of the squigly brackets in order to use the apID
//one working url looks like 
//api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=bfcf3c1f54781a5d45ad618d1c8a4da9
var searchButton = document.getElementById("searchButton");
var currentInfo = document.getElementById("currentInfo");
var weatherCards = document.getElementsByClassName("card");
var keyAPI = "bfcf3c1f54781a5d45ad618d1c8a4da9";

function getCurrentWeather(){

    fetch('https://api.openweathermap.org/data/2.5/weather?q=Trenton&appid=bfcf3c1f54781a5d45ad618d1c8a4da9&units=imperial')
    .then((response) => {
        if (response.ok){
            console.log("API Accessed Successfully");
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

        //adding newly created elements to currentInfo
        currentInfo.appendChild(newTitle);
        currentInfo.appendChild(newTemp);
        currentInfo.appendChild(newWind);
        currentInfo.appendChild(newHumid);
        
    })
    .catch((error) => {
        console.log(error)
    });
}

function testFunction(){
    console.log("Its test function time");
}

searchButton.addEventListener("click", getCurrentWeather);
