window.onload = function() {
    window.setInterval(getTime, 1000);
    getTemp();
    populateAlarmOptions();
    getAllAlarms();
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

    alarmName = $('#alarmName').val();
    hours = $('#hours option:selected').text();
    mins = $('#mins option:selected').text();
    ampm = $('#ampm option:selected').text();

    var AlarmObject = Parse.Object.extend("Alarm");
    var alarmObject = new AlarmObject();

    alarmObject.save(
        {   'hours': hours,
            'mins': mins,
            'ampm': ampm,
            'alarmName': alarmName
        },
        {   success: function() {
                insertAlarm(hours, mins, ampm, alarmName);
                hideAlarmPopup();
            }
        }
    );
}

function insertAlarm(hours, mins, ampm, name) {
    var alarm, alarmName, timeDiv, text;

    //create the alarm entry
    alarm = $('<div>').addClass('flexible');
    text = $('<p>').html(name);
    alarmName = $('<div>').addClass('alarm-entry').html(text);
    text = $('<p>').html(hours + ':' +  mins + ampm)
    timeDiv = $('<div>').addClass('alarm-entry').html(text);
    alarm.append(timeDiv).append(alarmName);

    //add a button to delete the alarm
    var removeBtn = $('<input type="button" value="Remove" class="button right vertical-center" onclick="removeAlarm()"/>');
    removeBtn = $('<div>').append(removeBtn);
    alarm.append(removeBtn);

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

function getAllAlarms() {
    Parse.initialize("DLZ29nzgM1Mf5tZHA1ktZBm2hnnH5LLX03eCA0pF", "HSHOLZReqnKULWZTqIN8s0lplrBovrrcJhNhmJ0h");

    var AlarmObject = Parse.Object.extend('Alarm');
    var query = new Parse.Query(AlarmObject);

    query.find({
        success: function(results) {
            var hours, mins, ampm, name;

            for (var i = 0; i < results.length; i++) {
                hours = results[i].get('hours');
                mins = results[i].get('mins');
                ampm = results[i].get('ampm');
                name = results[i].get('alarmName');

                insertAlarm(hours, mins, ampm, name);
                // insertAlarm(results[i].get('time'), results[i].get('alarmName'));
            }
        }
    });
}