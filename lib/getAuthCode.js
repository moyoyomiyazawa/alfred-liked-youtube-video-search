'use strict';

const alfy = require('alfy');
const createItem = require('./createItem');

function getAuthCode(oauth2Client, scopes) {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scopes,
  });
  alfy.output([
    createItem('Authorize this app by visiting this url.', '', authUrl),
  ]);
}

module.exports = getAuthCode;
