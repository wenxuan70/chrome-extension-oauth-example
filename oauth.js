'use strict';

const config = {
    endpoint: "your endpoint", // e.g. "http://localhost:8000"
    clientId: "your client id",
    redirectUri: "https://<extension-id>.chromiumapp.org",
    applicationName: "your application name",
    originationName: "your organization name"
}

window.onload = function () {
    const signUrl = getSignUrl();
    document.querySelector('button').addEventListener('click', function () {
        chrome.identity.launchWebAuthFlow(
            {'url': signUrl, 'interactive': true},
            function (redirectUrl) {
                if (redirectUrl) {
                    let hashtagIndex = redirectUrl.indexOf('#');
                    let questionMaskIndex = redirectUrl.indexOf('?');
                    const accessToken = redirectUrl.substring(hashtagIndex + 7, questionMaskIndex);
                    getUserInfo(accessToken);
                } else {
                    renderPre("Login failed");
                }
            }
        );
    });
};

function getSignUrl() {
    return `${config.serverUrl}/login/oauth/authorize?client_id=${config.clientId}&response_type=token&redirect_uri=${encodeURIComponent(config.redirectUri)}&scope=openid&state=${config.appName}`;
}

function getUserInfo(accessToken) {
    fetch(`${config.serverUrl}/api/userinfo`, {
        method: 'GET',
        async: true,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }
    })
        .then(res => res.json())
        .then(data => renderPre(JSON.stringify(data)));
}

function renderPre(content) {
    document.getElementById("content").innerText = content;
}
