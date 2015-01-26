window.onload = function() {
    window.setInterval(getTime, 1000);
    getTemp();
};

function getTime() {
    var date = new Date();
    var hours = date.getHours();
    var minutes = leadingZero(date.getMinutes());
    var seconds = leadingZero(date.getSeconds());
    var time = hours + ":" + minutes + ":" + seconds;

    document.getElementById('clock').innerHTML = time;
}

function leadingZero(timeVal) {
    if (timeVal < 10) {
        return "0" + timeVal;
    }
    return timeVal;
}

function getTemp() {
    var url = 'https://api.forecast.io/forecast/45a099af090167125dac1eb898fe443d/35.300399,-120.662362?callback=?';
    var success = function(data) {
        var icon = 'img/' + data.daily.icon + '.png';
        var forecast = $('<p class="small">').html(data.daily.summary);
        var bgColor = getBgColor(data.daily.data[0].temperatureMax);

        $('#forecast-icon').attr('src', icon);
        $('#forecast-label').html(forecast);
        $('body').addClass(bgColor);
    };

    $.getJSON(url, success);

    function getBgColor(temp) {
        var color;

        if (temp < 60) {
            color = 'cold';
        }
        else if (temp < 70) {
            color = 'chilly';
        }
        else if (temp < 80) {
            color = 'nice';
        }
        else if (temp < 90) {
            color = 'warm';
        }
        else {
            color = 'hot';
        }

        return color;
    }
}
