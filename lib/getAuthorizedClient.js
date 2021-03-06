'use strict';

const fs = require('fs');
const getNewToken = require('./getNewToken');
const storeToken = require('./storeToken');


async function getAuthorizedClient(oauth2Client, tokenPath, authorizationCode) {
  try {
    const token = fs.readFileSync(tokenPath, 'utf-8');
    oauth2Client.setCredentials(JSON.parse(token));
    return oauth2Client;
  } catch (error) {
    const newToken = await getNewToken(oauth2Client, authorizationCode);
    oauth2Client.setCredentials(newToken);
    storeToken(tokenPath, newToken);
    return oauth2Client;
  }
}

module.exports = getAuthorizedClient;
