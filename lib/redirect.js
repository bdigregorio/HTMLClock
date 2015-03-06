window.onload = function() {
    var oauth_response = window.location.hash.substr(1).split("&");

    if(oauth_response[0].split("=")[0] == "access_token" ) {
        window.opener.datastore.access_token = oauth_response[0].split("=")[1];
        window.opener.datastore.uid = oauth_response[2].split("=")[1];
        window.opener.datastore.signinCallback();
    }

    window.close();
};
