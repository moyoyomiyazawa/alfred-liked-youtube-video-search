'use strict';

function getAuthUrl(oauth2Client, scopes) {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
  });
  return authUrl;
}

module.exports = getAuthUrl;
