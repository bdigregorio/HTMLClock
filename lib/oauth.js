var datastore;

window.onload = function() {
    datastore = oauthInit();
    datastore.setup();
    console.log('breakpoint me?');
};

function oauthInit() {
    this.authUrl = 'https://api.imgur.com/oauth2/authorize?client_id=4af16cfadce252e&response_type=token';

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

        var oauth_response = window.location.hash.substr(1).split("&");

        if(oauth_response[0].split("=")[0] == "access_token" ) {
            window.opener.datastore.access_token = oauth_response[0].split("=")[1];
            window.opener.datastore.uid = oauth_response[2].split("=")[1];
            window.opener.datastore.signinCallback();
        }
        
        window.close();
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
