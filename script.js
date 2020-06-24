$(document).ready(function () {
    var searchList = $(".search_list");
    var submitBtn = $("#submit_btn");
    var cityInput = $("#city_input");
    var searchArray = ["Raleigh"];
    var weatherResults = {};

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
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            // console.log("full response", response);
            weatherLog(response);
            weatherRender();
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
    }

    function datePlusDay(date, index) {
        var new_date = date.add(index, 'day');
        var month = new_date.month();
        var day = new_date.date();
        var year = new_date.year();
        return "" + (month + 1) + "/" + day + "/" + year;
    }

    function weatherRender() {
        // get the header to update
        // organize the container to clear


        var box = $("#box")
        for (i = 0; i <= 5; i++) {
            var current = weatherResults[i];
            var row = makeRow();
            var date = makeColumn(current.date);
            var UV = makeColumn("NA")
            var sky = makeColumn(current.sky);
            var temp = makeColumn(current.temp);
            var humidity = makeColumn(current.humidity);
            var wind = makeColumn(current.wind);
            row.append(date, UV, sky, temp, humidity, wind);
            box.append(row);
        }
    }

    function makeRow() {
        return $("<div>").attr("id", "day").addClass("row day border-top")
    }

    function makeColumn(words) {
        var p = $("<p>").text(words);
        return $("<div>").addClass("col-2").append(p);
    }

    renderList();

});