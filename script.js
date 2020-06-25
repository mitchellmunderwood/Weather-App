$(document).ready(function () {
    var searchList = $(".search_list");
    var submitBtn = $("#submit_btn");
    var cityInput = $("#city_input");
    var searchArray = ["Raleigh"];
    var weatherResults = {};
    var box = $("#box")
    var header = $("#city_name")

    cityInput.keydown(function (event) {
        if (event.key === 'Enter') {
            var searchText = cityInput.val();
            searchArray.push(searchText);
            renderList();
            weatherPull(searchText);

        }
    });

    submitBtn.on("click", function (event) {
        event.preventDefault();
        var searchText = cityInput.val();
        searchArray.push(searchText);
        renderList();
        weatherPull(searchText);

    });

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

    function weatherPull(searchText) {
        var APIKey = "166a433c57516f51dfab1f7edaed8413";
        var queryURL = "https://api.openweathermap.org/data/2.5/forecast?" + "q=" + searchText + "&appid=" + APIKey;
        $.ajax({
            async: false,
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            // console.log("full response", response);
            weatherLog(response);

        });
    }



    function weatherLog(response) {
        var indices = [0, 8, 16, 24, 32, 39]

        for (i = 0; i < indices.length; i++) {

            var conditions = {};
            conditions.sky = response.list[indices[i]].weather[0].description;
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
        UVLog(response);

    }



    function UVLog(response) {
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
            weatherRender(cityInput.val());
        });

    }

    function datePlusDay(date, index) {
        var new_date = date.add(index, 'day');
        var month = new_date.month();
        var day = new_date.date();
        var year = new_date.year();
        return "" + (month + 1) + "/" + day + "/" + year;
    }

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
            var sky = makeColumn(current.sky);
            var temp = makeColumn(current.temp);
            var humidity = makeColumn(current.humidity);
            var wind = makeColumn(current.wind);
            row.append(date, sky, UV, temp, humidity, wind);
            box.append(row);
        }
    }

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

    function makeUV(num) {
        var p = $("<p>").text(num);
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
        p.attr("style", "border-radius:5px;background:" + background + ";")
        return $("<div>").addClass("col-2").append(p);
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

    renderList();
    headerRender();

});