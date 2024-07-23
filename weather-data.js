// state
let currCity ="los angeles";
let units = "metric";
let countrys ;

// Selectors
let city = document.querySelector(".weather__city");
let datetime = document.querySelector(".weather__datetime");
let weather__forecast = document.querySelector('.weather__forecast');
let weather__temperature = document.querySelector(".weather__temperature");
let weather__icon = document.querySelector(".weather__icon");
let weather__minmax = document.querySelector(".weather__minmax")
let weather__realfeel = document.querySelector('.weather__realfeel');
let weather__humidity = document.querySelector('.weather__humidity');
let weather__wind = document.querySelector('.weather__wind');
let weather__pressure = document.querySelector('.weather__pressure');
let cityName        = document.getElementById("cityName")
let li_continer      =  document.querySelector('.autocomplet');
let close_symb     =  document.querySelector('.close-symb')

let celsius =document.querySelector(".weather_unit_celsius")
celsius.style.color = "orangered"
close_symb.style.display ="none"
let farenheit =document.querySelector(".weather_unit_farenheit")
// search

document.querySelector(".weather__search").addEventListener('submit', e => {
    let search = document.querySelector(".weather__searchform");
    // prevent default action
    e.preventDefault();
    // change current city
    currCity = search.value;
    // get weather forecast 
    getWeather();
    // clear form
    search.value = ""
})

// units
celsius.addEventListener('click', (e) => {
    if(units !== "metric"){
        // change to metric
        units = "metric"

        // get weather forecast 
        getWeather()
    }
    e.target.style.color = "orangered"
    farenheit.style.color=""
})

farenheit.addEventListener('click', (e) => {
    if(units !== "imperial"){
        // change to imperial
        units = "imperial"

        // get weather forecast 
        getWeather()
    }
    e.target.style.color = "orangered"
    celsius.style.color=""


})
let  allCiteis = [];

function convertTimeStamp(timestamp, timezone){
     const convertTimezone = timezone / 3600; // convert seconds to hours 

    const date = new Date(timestamp * 1000);
    
    const options = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        timeZone: `Etc/GMT${convertTimezone >= 0 ? "-" : "+"}${Math.abs(convertTimezone)}`,
        hour12: true,
    }
    return date.toLocaleString("en-US", options)
   
}

 

// convert country code to name
function convertCountryCode(country){
    let regionNames = new Intl.DisplayNames(["en"], {type: "region"});
    return regionNames.of(country)
}

function getWeather(){

    const API_KEY = 'bdd952e98574eb717c4ae228f48ed260'
fetch(`https://api.openweathermap.org/data/2.5/weather?q=${currCity}&appid=${API_KEY}&units=${units}`).then(res => res.json()).then(data => {
    console.log(data)
    city.innerHTML = `${data.name}, ${convertCountryCode(data.sys.country)}`
    datetime.innerHTML = convertTimeStamp(data.dt, data.timezone); 
    weather__forecast.innerHTML = `<p>${data.weather[0].main}`
    weather__temperature.innerHTML = `${data.main.temp.toFixed()}&#176`
    weather__icon.innerHTML = `   <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png" />`
    weather__minmax.innerHTML = `<p>Min: ${data.main.temp_min.toFixed()}&#176</p><p>Max: ${data.main.temp_max.toFixed()}&#176</p>`
    weather__realfeel.innerHTML = `${data.main.feels_like.toFixed()}&#176`
    weather__humidity.innerHTML = `${data.main.humidity}%`
    weather__wind.innerHTML = `${data.wind.speed} ${units === "imperial" ? "mph": "m/s"}` 
    weather__pressure.innerHTML = `${data.main.pressure} hPa`
})
}
 async function getCities(){

       const response = await fetch("worldcities.json");
     const data = await response.json();
     return data


}
document.body.addEventListener('load', getWeather() ,   allCiteis = getCities() , allCiteis.then(data => (countrys = data)))
cityName.addEventListener('keyup',changed)
close_symb.addEventListener('click' , () => {
    cityName.value = ""
    li_continer.innerHTML= ""
    close_symb.style.display ="none"

})



function changed(e){
    let starts_with = e.target.value.toUpperCase()
    let filteredCitys = []
    console.log(starts_with);
    if(starts_with != ""){
        filteredCitys = countrys.filter((country) => {
           return country.city.slice(0, starts_with.length).toUpperCase() == starts_with
       });
       close_symb.style.display = "none"

    }
    
    close_symb.style.display = ""
    li_continer.innerHTML =""
    li_continer.style.maxHeight = '400px'
    if(starts_with === "")   close_symb.style.display = "none"

    filteredCitys.map(city => {

        let li =  document.createElement("li");
        let div = document.createElement("div");
        div.addEventListener('click', (e) => {
            currCity = e.target.innerHTML
            getWeather()
            li_continer.style.maxHeight = '0px'
            close_symb.style.display ="none"

            cityName.value = city.city
        })
        div.innerHTML = city.city +', '+city.country
    
        li.appendChild(div)
    
        li_continer.appendChild(li)

    })
}



  