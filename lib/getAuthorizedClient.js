'use strict';

const fs = require('fs');
const getAuthCode = require('./getAuthCode');
const getNewToken = require('./getNewToken');
const storeToken = require('./storeToken');


async function getAuthorizedClient(oauth2Client, tokenPath, authorizationCode, scopes) {
  let token = '';
  try {
    token = fs.readFileSync(tokenPath, 'utf-8');
  } catch (error) {
    if (!authorizationCode) {
      getAuthCode(oauth2Client, scopes);
      return;
    }
    const newToken = await getNewToken(oauth2Client, authorizationCode);
    oauth2Client.credentials = newToken;
    storeToken(tokenPath, newToken);
    return oauth2Client;
  }
  oauth2Client.credentials = JSON.parse(token);
  return oauth2Client;
}

module.exports = getAuthorizedClient;
