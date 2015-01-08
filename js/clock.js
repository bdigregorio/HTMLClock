window.onload = function() {
    window.setInterval(getTime, 1000);
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