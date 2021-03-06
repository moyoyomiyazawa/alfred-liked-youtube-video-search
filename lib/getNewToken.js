'use strict';

async function getNewToken(oauth2Client, authorizationCode) {
  const { tokens } = await oauth2Client.getToken(authorizationCode);
  return tokens;
}

module.exports = getNewToken;
