var datastore;

window.onload = function() {
    datastore = oauthInit();
    datastore.setup();
    console.log('breakpoint me?');
};

function oauthInit() {
    // this.clientId = '4af16cfadce252e';
    // this.responseType = 'token';
    this.authUrl = 'https://api.imgur.com/oauth2/authorize?client_id=4af16cfadce252e&response_type=token';
    this.authUrl += '&state=http://localhost:8080/lib/redirect.html';

    this.setup = function() {
        $('#login-button').click(function() {
            datastore.login();
        });
    };

    this.login = function() {
        var redirectWindow = window.open(datastore.authUrl, 'newwindow', config='height=400, width=500');
        redirectWindow.onload = this.redirectInit;
    };

    this.redirectInit = function() {
        console.log('redirectInit function called');

        // First, parse the query string
        var params = {}, queryString = location.hash.substring(1),
            regex = /([^&=]+)=([^&]*)/g, m;
        while ((m = regex.exec(queryString)) === true) {
          params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
        }

        // And send the token over to the server
        var req = new XMLHttpRequest();
        // consider using POST so query isn't logged
        req.open('GET', 'https://' + window.location.host + '/catchtoken?' + queryString, true);

        req.onreadystatechange = function (e) {
            if (req.readyState == 4) {
                if(req.status == 200){
                    window.location = params.state;
                    datastore.signinCallback();
                }
                else {
                    console.log('error code ' + req.status);
                }
                window.close();
            }
        };
        req.send(null);
    };

    this.signinCallback = function() {
        console.log('signinCallback function called');
    };

    return {
        setup: setup,
        authUrl: authUrl,
        login: login,
        redirectInit: redirectInit,
        signinCallback: signinCallback
    };
}
