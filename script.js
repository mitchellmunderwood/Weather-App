$(document).ready(function () {

    // object handlers
    var searchList = $(".search_list");
    var submitBtn = $("#submit_btn");
    var cityInput = $("#city_input");
    var box = $("#box")
    var header = $("#city_name")

    // data storage and localstorage
    var weatherResults = {};

    let searchArray = ["Raleigh"];
    if (localStorage.getItem("searchArray")) {
        searchArray = JSON.parse(localStorage.getItem("searchArray"));
    }

    // event handlers

    // search for city
    cityInput.keydown(function (event) {
        var searchText = cityInput.val();
        if (event.key === 'Enter' && searchText !== "") {

            cityInput.val("");
            searchArray.push(searchText);
            localStorage.setItem("searchArray", JSON.stringify(searchArray));
            renderList();
            weatherPull(searchText);

        }
    });

    // search for city
    submitBtn.on("click", function (event) {
        event.preventDefault();
        var searchText = cityInput.val();
        if (searchText !== "") {

            cityInput.val("");
            searchArray.push(searchText);
            localStorage.setItem("searchArray", JSON.stringify(searchArray));
            renderList();
            weatherPull(searchText);

        }

    });

    // search for city already listed
    $(".search_list").on("click", function (event) {
        event.preventDefault();
        var searchText = event.target.innerHTML;
        searchArray.push(searchText);
        localStorage.setItem("searchArray", JSON.stringify(searchArray));
        renderList();
        weatherPull(searchText);
    })

    // clear searches
    $("#clear_btn").on("click", function (event) {
        event.preventDefault();
        searchArray = ["Raleigh"];
        localStorage.setItem("searchArray", JSON.stringify(searchArray))
        renderList();
        weatherPull(searchArray[0]);

    })

    // supporting function

    // search list rendering
    function renderList() {
        searchList.empty();
        for (i = 0; i < searchArray.length; i++) {
            var new_par = $("<p>").text(searchArray[i]).addClass("search_item");
            if (i === 0) {
                new_par.attr("id", "no_border_bottom");
            }
            searchList.prepend(new_par);
        }

    }

    // weather api data pull later call to log data function
    function weatherPull(searchText) {
        var APIKey = "166a433c57516f51dfab1f7edaed8413";
        var queryURL = "https://api.openweathermap.org/data/2.5/forecast?" + "q=" + searchText + "&appid=" + APIKey;
        $.ajax({
            async: false,
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            // console.log("full response", response);
            weatherLog(response, searchText);
        });
    }


    // weather data log and subsequent call to UV data log
    function weatherLog(response, city) {
        var indices = [0, 8, 16, 24, 32, 39]

        for (i = 0; i < indices.length; i++) {

            var conditions = {};
            conditions.sky = response.list[indices[i]].weather[0].main;
            conditions.icon = response.list[indices[i]].weather[0].icon;
            var tempC = response.list[indices[i]].main.temp;
            conditions.temp = Math.round(((tempC - 273.15) * 9 / 5) + 32);
            conditions.humidity = response.list[indices[i]].main.humidity;
            conditions.wind = response.list[indices[i]].wind.speed;

            var today = moment();
            var date = datePlusDay(today, i);

            conditions.date = date;
            weatherResults[i] = conditions;
        }
        console.log("logged info", weatherResults);
        UVLog(response, city);

    }

    // UV data log and subsequent call to data render function
    function UVLog(response, city) {
        var lon = response.city.coord.lon;
        var lat = response.city.coord.lat;
        var APIKey = "166a433c57516f51dfab1f7edaed8413";
        var queryURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey;
        $.ajax({
            async: false,
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            weatherResults[0].UVIndex = response.value;
            weatherRender(city);
        });

    }

    // data manipulation function
    function datePlusDay(date, index) {
        var new_date = date.add(index, 'day');
        var month = new_date.month();
        var day = new_date.date();
        var year = new_date.year();
        return "" + (month + 1) + "/" + day + "/" + year;
    }

    // weather table render function
    function weatherRender(name) {
        header.text(name);
        box.empty();
        headerRender()

        for (i = 0; i <= 5; i++) {
            var current = weatherResults[i];

            var row = makeRow();

            var date = makeColumn(current.date);
            if (i === 0) {
                var UV = makeUV(current.UVIndex);
            } else {
                var UV = makeColumn("NA")
            }
            var sky = makeIcon(current.icon);
            var temp = makeColumn(current.temp);
            var humidity = makeColumn(current.humidity);
            var wind = makeColumn(current.wind);

            row.append(date, sky, UV, temp, humidity, wind);
            box.append(row);
        }
    }

    // table header rendering
    function headerRender() {
        var row = makeHeader();
        var date = makeColumn("Date");
        var UV = makeColumn("UV")
        var sky = makeColumn("Sky");
        var temp = makeColumn("Temp ºF");
        var humidity = makeColumn("Hum %");
        var wind = makeColumn("Wind MPH");
        row.append(date, sky, UV, temp, humidity, wind);
        box.append(row);
    }

    // supporting HTML object functions
    function makeUV(num) {
        var span = $("<span>").text(num);
        var background;
        if (num <= 3) {
            background = "green";
        } else if (num > 3 && num <= 6) {
            background = "yellow";
        } else if (num > 6 && num <= 8) {
            background = "orange";
        } else {
            background = "red";
        }
        span.attr("style", "border-radius:5px;background:" + background + ";")
        return $("<div>").addClass("col-2").append(span);
    }

    function makeRow() {
        return $("<div>").attr("id", "day").addClass("row day border-top")
    }

    function makeHeader() {
        return $("<div>").attr("id", "day_header").addClass("row day")
    }

    function makeColumn(words) {
        var p = $("<p>").text(words);
        return $("<div>").addClass("col-2").append(p);
    }

    function makeIcon(num) {
        var img = $("<img>").attr("src", "http://openweathermap.org/img/wn/" + num + "@2x.png")
        return $("<div>").addClass("col-2").append(img);
    }

    // initiating functions

    renderList();
    weatherPull(searchArray[searchArray.length - 1]);

});