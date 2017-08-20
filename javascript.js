
var APIkey = "YOUR_PRIVATE_API_KEY_IN_HERE"; //you have to provide it before you can use openweathermap.org
var temperatureid, weatherid, windspid, winddirid, pressureid, cityid, countryid;
var longitude, latitude, city, temp, windspeed, winddir, pressure, weather, iconCode, weatherCode;
var myTextbox;
var country = "";
var city = "";
var units = "C";

function getIds() {
    temperatureid = document.getElementById("temperature");
    weatherid = document.getElementById("weather");
    windspid = document.getElementById("windsp");
    winddirid = document.getElementById("winddir");
    pressureid = document.getElementById("pressure");
    cityid = document.getElementById("cityname");
    countryid = document.getElementById("countrycode");

    myTextbox = document.getElementById('addressInput');
}

function getIPLocation() {
    var ajaxdone = Promise.resolve($.ajax({url: "https://freegeoip.net/json/",
                                           cache: false}));
    ajaxdone.then(function(result) {
        city = result["city"];
        country = result["country_code"];
        latitude = result["latitude"];
        longitude = result["longitude"];
    }, function(xhrObj) {
        alert("Ajax error!:", xhr,status,error);
    }).then(showInfo).then(getWeather);
}

function savePosition(position) {
    latitude = position['coords']['latitude'];
    longitude = position['coords']['longitude'];
    getWeather();
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(savePosition, getIPLocation, {enableHighAccuracy:true, maximumAge:600000, timeout:1000});
    } else {
        getIPLocation();
    }
}

function getWeather() {
    var url;
    if (city != "") {
        url = "https://api.openweathermap.org/data/2.5/weather?q="+city+"&mode=json&APPID="+APIkey;
    } else {
        url = "https://api.openweathermap.org/data/2.5/weather?lat="+latitude+"&lon="+longitude+"&mode=json&APPID="+APIkey;
    }
    $.ajax({url: url,
            cache: false,
           success: function(result) {
               if (result.hasOwnProperty('name')) {
                   city = result['name'];
               }
               if (result['sys'].hasOwnProperty('country')) {
                   country = result['sys']['country'];
               }
               if (result.hasOwnProperty('weather')) {
                   //if (result['weather'].hasOwnProperty('description')) {
                   weather = result['weather'][0]['description'];
                   weatherCode = result['weather'][0]['id'];
                   iconCode = result['weather'][0]['icon'];
               }

               temp = result['main']['temp'];
               pressure = result['main']['pressure'];
               windspeed = result['wind']['speed'];
               winddir = result['wind']['deg'];

               showInfo();
           },
           error: function(error) {
               alert("OpenWeather API error!")
           }});
}

function showCity() {
    if (city == "") {
        cityid.innerText = "Could not be found"
    } else {
        cityid.innerText = city;
    }
}

function showCountry() {
    if (country == "") {
        countryid.innerText = "Could not be found"
    } else {
        countryid.innerText = country;
    }
}

function showTemp() {
    var tmp = convertUnits();
    tmp = Math.round(tmp).toString();
    temperatureid.innerHTML = tmp + "\&#176;" + units;
}

function getWindDirection() {
    var winDirArray = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"]
    var winddirection = Math.round(winddir / 22.5)
    if (winddirection >=16) {
        winddirection = 0;
    }
    return winDirArray[winddirection];
}

function showWind() {
    var speedunit;
    if (units == "imp") {//it should be "F", it's not finished anyway
        speedunit = " miles/hour"
    } else {
        speedunit = " meters/second"
    }
    windspid.innerHTML = windspeed + speedunit;
    var direction = getWindDirection();
    winddirid.innerHTML = winddir + "\&#176; (" + direction + ")";
}

function showPres() {
    pressureid.textContent = pressure + " hpa";
}

function showWeather() {
    weatherid.textContent = weather;
}

function showIcon() {
    setIcon(iconCode);
}

function showInfo() {
    $('.boxit').matchHeight();
    showCity();
    showCountry();
    showTemp();
    showWind();
    showPres();
    showWeather();
    $('.boxit').matchHeight();
    showIcon();
}

function convertUnits() {
    var t = temp -273.15;
    if (units == "C") {
        return t;
    } else {
        t *= (9/5);
        t += 32;
    }
    return t;
}

function setIcon(code){
    switch(code) {
        case "01d":
            $("#icon").attr("class","wi wi-day-sunny");
            break;
        case "01n":
            $("#icon").attr("class","wi wi-night-clear");
            break;
        case "02d":
            $("#icon").attr("class","wi wi-day-cloudy");
            break;
        case "02n":
            $("#icon").attr("class","wi wi-night-alt-cloudy");
            break;
        case "03d":
        case "03n":
            $("#icon").attr("class","wi wi-cloud");
            break;
        case "04d":
        case "04n":
            $("#icon").attr("class","wi wi-cloudy");
            break;
        case "09d":
        case "09n":
        case "10d":
        case "10n":
            $("#icon").attr("class","wi wi-rain");
            break;
        case "11d":
        case "11n":
            $("#icon").attr("class","wi wi-thunderstorm");
            break;
        case "13d":
        case "13n":
            $("#icon").attr("class","wi wi-snow");
            break;
        case "50d":
        case "50n":
            $("#icon").attr("class","wi wi-fog");
            break;
        default:
            $("#icon").attr("class","wi wi-thermometer");
    }
}

function checkkey(event) {
    if (event.which === 13) {
        city = document.getElementById('addressInput').value.toString();
        getWeather();
        event.preventDefault();
    }
}

$(function() {
    getIds();

    $("#btnmet").click(function(){
        units = "C";
        showTemp();
        showWind();
    });
    $("#btnimp").click(function(){
        units = "F";
        showTemp();
        showWind();
    });
    $("#reload").click(function(){
        city = "";
        getLocation();
    });

    $("#findbtn").click(function(){
        city = document.getElementById('addressInput').value.toString();
        getWeather();
    });

    $("#about").click(function() {
       $("#about").hide();
    });

    $("#btnabout").click(function() {
       $("#about").show();
    });

    myTextbox.addEventListener('keydown', checkkey, false);
});
