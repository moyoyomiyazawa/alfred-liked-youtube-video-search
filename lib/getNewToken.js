'use strict';

async function getNewToken(oauth2Client, authorizationCode) {
  const newToken = oauth2Client.getToken(authorizationCode);
  return newToken;
}

module.exports = getNewToken;
