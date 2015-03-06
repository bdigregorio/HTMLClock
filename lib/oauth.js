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
    };

    this.signinCallback = function() {
        console.log('signinCallback function called');
        console.log('access token: ' + datastore.access_token);
        console.log('user id: ' + datastore.uid);
    };

    return {
        setup: setup,
        authUrl: authUrl,
        login: login,
        // redirectInit: redirectInit,
        signinCallback: signinCallback
    };
}
