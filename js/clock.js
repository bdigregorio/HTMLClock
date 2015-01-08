window.onload = function() {
    window.setInterval(getTime, 1000);
};

function getTime() {
    var date = new Date();
    var time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    
    document.getElementById('clock').innerHTML = time;
}