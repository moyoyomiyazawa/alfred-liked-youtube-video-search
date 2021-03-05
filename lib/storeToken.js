'use strict';

function storeToken(tokenPath, token) {
  fs.writeFile(tokenPath, JSON.stringify(token), (err) => {
    if (err) throw err;
    console.log('Token stored to ' + TOKEN_PATH);
  });
}

module.exports = storeToken;
