var loggedInUser = '';

window.onload = function() {
    window.setInterval(getTime, 1000);
    Parse.initialize("DLZ29nzgM1Mf5tZHA1ktZBm2hnnH5LLX03eCA0pF", "HSHOLZReqnKULWZTqIN8s0lplrBovrrcJhNhmJ0h");
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

    $.getJSON(url, success);
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
            'alarmName': alarmName,
            'userId': loggedInUser
        },
        {   success: function() {
                insertAlarm(hours, mins, ampm, alarmName);
                hideAlarmPopup();
            }
        }
    );
}

function insertAlarm(hours, mins, ampm, name) {
    var alarm, alarmName, timeDiv, text, removeBtn;

    text = $('<p>').html(name);
    alarmName = $('<div>').addClass('alarm-entry').html(text);

    text = $('<p>').html(hours + ':' +  mins + ampm)
    timeDiv = $('<div>').addClass('alarm-entry').html(text);

    removeBtn = $('<input type="button" value="Remove"/>').click(removeAlarm);
    removeBtn = $('<div>').addClass('alarm-entry').append(removeBtn.addClass('button'));

    //create the alarm entry
    alarm = $('<div>').addClass('flexible');
    alarm.append(removeBtn).append(timeDiv).append(alarmName);

    $('#alarms').append(alarm);
}

function removeAlarm() {
    var name = $(this).parent().next().next().text();
    var alarmRow = $(this).parent().parent();
    var AlarmObject = Parse.Object.extend('Alarm');
    var query = new Parse.Query(AlarmObject);

    query.equalTo('alarmName', name);
    query.find({
        success: function(results) {
            results[0].destroy();
            alarmRow.remove();
        },
        error: function() {
            alert('Problem deleting alarm from Parse');
        }
    });
}

function populateAlarmOptions() {
    var hours = $('#hours');
    var mins = $('#mins');
    var option;

    for (var i = 1; i < 13; i++) {
        option = $('<option>').html(leadingZero(i));
        hours.append(option);
    }

    for (var i = 5; i < 61; i += 5) {
        option = $('<option>').html(leadingZero(i));
        mins.append(option);
    }
}

function getAllAlarms(userId) {
    var AlarmObject = Parse.Object.extend('Alarm');
    var query = new Parse.Query(AlarmObject);

    query.contains('userId', loggedInUser);

    query.find({
        success: function(results) {
            var hours, mins, ampm, name;

            for (var i = 0; i < results.length; i++) {
                hours = results[i].get('hours');
                mins = results[i].get('mins');
                ampm = results[i].get('ampm');
                name = results[i].get('alarmName');

                insertAlarm(hours, mins, ampm, name);
            }
        }
    });
}

function signInCallback(authResult) {
    var getProfileUrl = 'https://www.googleapis.com/plus/v1/people/me';

    if (authResult['status']['signed_in']) {
        // Update the app to reflect a signed in user
        document.getElementById('signinButton').setAttribute('style', 'display: none');
        $('#sign-out-text').removeClass('hide');
        displayUserData();
    } else {
        // Update the app to reflect a signed out user
        console.log('Sign-in state: ' + authResult['error']);
        if (authResult['error'] === 'user_signed_out') {
            $('#welcome-text').addClass('hide').text('');
            $('#sign-out-text').addClass('hide');
            $('#alarms').empty();
            document.getElementById('signinButton').setAttribute('style', 'display: inline');
            loggedInUser = '';
        }
    }
}

function displayUserData() {
    gapi.client.load('plus', 'v1', function() {
        var request = gapi.client.plus.people.get({
            'userId': 'me'
        });
        request.execute(function(resp) {
            console.log('Retrieved profile for: ' + resp.displayName);
            $('#welcome-text').text('Welcome ' + resp.displayName).removeClass('hide');
            getAllAlarms(resp.id);
            loggedInUser = resp.id;
        });
    });
}

function signOut() {
    gapi.auth.signOut();
}
