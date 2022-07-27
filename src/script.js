import _ from 'lodash';
import cities from 'cities.json';

const img = document.querySelector('.giph');
const weatherPattern = document.querySelector('.weather-pattern');
const userInput = document.querySelector('input')
const locationInput = document.querySelector('.location')
const formButton = document.querySelector('.form-btn')
const icon = document.querySelector('.icon')
const weatherData = document.querySelector('.weather-data')
const temperatureData = document.querySelector('.temp-current')
const locationCountry = document.querySelector('.location-country')
const pollutionData = document.querySelector('.pollution-data')
const introText = document.querySelector('.intro-text')
const randomBtn = document.querySelector('.random-btn')
const circleLoader = document.querySelector('.loader')
let cityName;
let latitude;
let longitude;
let randomCityName;
let loader;

function randomCity() {
    let random = Math.floor(Math.random() * cities.length);
    randomCityName = cities[random].name
}

// displayLoader(() => {
//     loader.style.display = 'grid'
//   }, "3000")

formButton.addEventListener('click', (e) => {
    e.preventDefault();
    cityName = userInput.value;
    getWeatherData();
})

randomBtn.addEventListener('click', () => {
    randomCity();
    cityName = randomCityName;
    userInput.value = '';
    getWeatherData();
})



async function getWeatherData() {
    await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=a11e3a375cafd9c41289e202182f0572`, {
    mode: 'cors'
    })

    .then(response => response.json())
    .then(function(data) {
        console.log(data)
        const weather = data.weather[0].main;
        icon.src = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
        weatherPattern.innerHTML = weather;
        locationInput.innerHTML = cityName;
        temperatureData.innerHTML = (data.main.temp - 273.15).toFixed(1) + '°C';
        locationCountry.innerHTML = ', ' + data.sys.country
        latitude = data.coord.lat;
        longitude = data.coord.lon;
        getPollution();
        getWeatherGiph();
        introText.style.display = 'none';
        weatherData.style.visibility = 'visible'; 
    })
    .catch(err => console.log(err))
}

async function getPollution() {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=a11e3a375cafd9c41289e202182f0572`, {
        mode: 'cors'
    })

    response.json().then(function(response) {
        let pollutionNumber = response.list[0].main.aqi

        switch (pollutionNumber) {
            case 1:
                pollutionData.innerHTML = 'Air Quality: Good';
                break;
            case 2:
                pollutionData.innerHTML = 'Air Quality: Fair';
                break;
            case 3: 
                pollutionData.innerHTML = 'Air Quality: Moderate';
                break;
            case 4:
                pollutionData.innerHTML = 'Air Quality: Poor';
                break;
            case 5:
                pollutionData.innerHTML = 'Air Quality: Very Poor';
                break
            default:
                pollutionData.innerHTML = 'Air Quality: NA';
        }
      });
}

async function getWeatherGiph() {
    const response = await fetch(`https://api.giphy.com/v1/gifs/translate?api_key=ZC6sHZ4gOC7NDoeUh83UZITXCduk6wgR&s=${cityName}`, {
        mode: 'cors'
    })

    response.json().then(function(response) {
        img.src = response.data.images.original.url;
      });
}

