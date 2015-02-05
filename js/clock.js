window.onload = function() {
    window.setInterval(getTime, 1000);
    getTemp();
    populateAlarmOptions();
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

function showAlarmPopup() {
    $('#mask').removeClass('hide');
    $('#popup').removeClass('hide');
}

function hideAlarmPopup() {
    $('#mask').addClass('hide');
    $('#popup').addClass('hide');
}

function addAlarm() {
    var hours, mins, ampm, alarmName;

    hours = $('#hours option:selected').text();
    mins = $('#mins option:selected').text();
    ampm = $('#ampm option:selected').text();
    alarmName = $('#alarmName').val();

    insertAlarm(hours, mins, ampm, alarmName);
    hideAlarmPopup();
}

function insertAlarm(hours, mins, ampm, name) {
    var alarm, alarmName, time;

    //create the alarm
    alarm = $('<div>').addClass('flexible');
    alarmName = $('<div>').addClass('alarm-entry').html(name);
    time = $('<div>').addClass('alarm-entry').html(hours + ':' +  mins + ampm);
    alarm.append(time).append(alarmName);

    $('#alarms').append(alarm);
}

function populateAlarmOptions() {
    var hours = $('#hours');
    var mins = $('#mins');
    var option;

    for (var i = 1; i < 13; i++) {
        option = $('<option>').html(('0' + i).slice(-2));
        hours.append(option);
    }

    for (var i = 1; i < 61; i++) {
        option = $('<option>').html(('0' + i).slice(-2));
        mins.append(option);
    }
}