localStorage.clear();

function genSearchList(previousSearchList) {
    $("#search-history").empty();

    var keys = Object.keys(previousSearchList);
    for (var i = 0; i < keys.length; i++) {
        var searchListItem = $("<button>");
        searchListItem.addClass("list-group-item list-group-item-action");

        var splitString = keys[i].toLowerCase().split(" ");
        for (var k = 0; k < splitString.length; k++) {
            splitString[k] = 
            splitString[k].charAt(0).toUpperCase() + splitString[k].substring(1);
        }

        var modifiedCity = splitString.join(" ");
        searchListItem.text(modifiedCity);

        $("#search-history").append(searchListItem);
    }
}

function renderWeatherForecast(city, previousSearchList) {
    genSearchList(previousSearchList);

    var queryURL = "https://api.openweathermap.org/data/2.5/weather?&units=imperial&appid=84128f860fec656407a57fd35e7bbe07&q=" +
    city;

    var queryURL2 = "https://api.openweathermap.org/data/2.5/forecast?&units=imperial&appid=84128f860fec656407a57fd35e7bbe07&q=" +
    city;

    $.ajax({
        url: queryURL, 
        method: "GET"
    })
     .then(function(currentWeather) {
        console.log(queryURL);

        console.log(currentWeather);

        var currentConditions = moment();

        var renderConditions = $("<h3>");
        $("#city").empty();
        $("#city").append(
            renderConditions.text("(" + currentConditions.format("M/D/YYYY") + ")")
        );

        var cityName = $("<h3>").text(currentWeather.name);
        $("#city").prepend(cityName);

        var conditionsIcon = $("<img>");
        conditionsIcon.attr(
            "src", "https://openweathermap.org/img/w/" + currentWeather.weather[0].icon + ".png"
        );
        $("#weather-icon").empty();
        $("#weather-icon").append(conditionsIcon);

        $("#current-temp").text("Temperature: " + currentWeather.main.temp + " °F");
        $("#current-humidity").text("Humidity: " + currentWeather.main.humidity + "%");
        $("#current-wind").text("Wind Speed: " + currentWeather.wind.speed + " MPH");

        latitude = currentWeather.coord.lat;
        longitude = currentWeather.coord.lon;
        
        var queryURL3 =
        "https://api.openweathermap.org/data/2.5/uvi/forecast?&units=imperial&appid=84128f860fec656407a57fd35e7bbe07&q=" +
        "&lat=" +
        latitude +
        "&lon=" +
        longitude;

      $.ajax({
        url: queryURL3,
        method: "GET"
      }).then(function(uvIndex) {
        console.log(uvIndex);

        var uvIndexRender = $("<button>");
        uvIndexRender.addClass("btn btn-danger");

        $("#current-uv").text("UV Index: ");
        $("#current-uv").append(uvIndexRender.text(uvIndex[0].value));
        console.log(uvIndex[0].value);

        $.ajax({
          url: queryURL2,
          method: "GET"
        }).then(function(forecast) {
          console.log(queryURL2);

          console.log(forecast);
          for (var i = 6; i < forecast.list.length; i += 8) {

            var forecastDay = $("<h5>");

            var forecastPosition = (i + 2) / 8;

            console.log("#forecast-date-" + forecastPosition);

            $("#forecast-day-" + forecastPosition).empty();
            $("#forecast-day-" + forecastPosition).append(
              forecastDay.text(currentConditions.add(1, "days").format("M/D/YYYY"))
            );

            var forecastIcon = $("<img>");
            forecastIcon.attr(
              "src",
              "https://openweathermap.org/img/w/" +
                forecast.list[i].weather[0].icon +
                ".png"
            );

            $("#forecast-icon-" + forecastPosition).empty();
            $("#forecast-icon-" + forecastPosition).append(forecastIcon);

            console.log(forecast.list[i].weather[0].icon);

            $("#forecast-temp-" + forecastPosition).text(
              "Temp: " + forecast.list[i].main.temp + " °F"
            );
            $("#forecast-humidity-" + forecastPosition).text(
              "Humidity: " + forecast.list[i].main.humidity + "%"
            );

            $(".forecasts").attr(
              "style",
              "background-color: #1e90ff; color: #ffffff;"
            );
          }
        });
      });
    });
}

$(document).ready(function() {
  var previousSearchListStr = localStorage.getItem("previousSearchList");

  var previousSearchList = JSON.parse(previousSearchListStr);

  if (previousSearchList == null) {
    previousSearchList = {};
  }

  genSearchList(previousSearchList);

  $("#search-result").hide();
  $("#five-day-forecast").hide();



  $("#search").on("click", function(event) {
    event.preventDefault();
    var city = $("#city-search")
      .val()
      .trim()
      .toLowerCase();

    if (city != "") {
    
      previousSearchList[city] = true;
    localStorage.setItem("previousSearchList", JSON.stringify(previousSearchList));

    renderWeatherForecast(city, previousSearchList);

    $("#search-result").show();
    $("#five-day-forecast").show();
    }

    
  });

  $("#search-history").on("click", "button", function(event) {
    event.preventDefault();
    var city = $(this).text();

    renderWeatherForecast(city, previousSearchList);

    $("#search-result").show();
    $("#five-day-forecast").show();
  });
});