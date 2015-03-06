window.onload = function() {
    var oauthResponse = window.location.hash.substr(1).split("&");

    if(oauthResponse[0].split("=")[0] == "access_token" ) {
        alert(window.location.hash.substr(1));
        window.opener.datastore.oauthResponse = oauthResponse;
        window.opener.datastore.accessToken = oauthResponse[0].split("=")[1];
        window.opener.datastore.userId = oauthResponse[2].split("=")[1];
        window.opener.datastore.signinCallback();
    }

    window.close();
};
