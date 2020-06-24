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
            // weatherPull(searchText);
        }
    });

    submitBtn.on("click", function (event) {
        event.preventDefault();
        var searchText = cityInput.val();
        searchArray.push(searchText);
        renderList();
        // weatherPull(searchText);
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

    renderList();

});