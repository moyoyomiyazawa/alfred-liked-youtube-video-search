'use strict';

const alfy = require('alfy');
const { google } = require('googleapis');

const createItem = require('./lib/createItem');
const getAuthCode = require('./lib/getAuthCode');
const getAuthorizedClient = require('./lib/getAuthorizedClient');
const getFavoriteVideos = require('./lib/getFavoriteVideos');

const scopes = ['https://www.googleapis.com/auth/youtube.readonly'];
const tokenPath = __dirname + '/' + 'alfred-youtube-search.json';
const authorizationCode = process.env.AUTHORIZATION_CODE;
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

// TODO: 細かい動作をリファクタリングする
(async () => {
  // 必要な環境変数が未設定の場合は警告を出す
  if (!clientId || !clientSecret) {
    alfy.output([
      createItem(
        'Please set environment variable. ⚠️',
        'Set CLIENT_ID and CLIENT_SECRET to workflow environment variable',
        ''
      ),
    ]);
    return;
  }

  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    'urn:ietf:wg:oauth:2.0:oob'
  );

  if (!authorizationCode) {
    getAuthCode(oauth2Client, scopes);
    return;
  }

  // TODO: キャッシュがある場合は認証をスルーする
  const auth = await getAuthorizedClient(oauth2Client, tokenPath, authorizationCode);
  const videos = await getFavoriteVideos(auth);

  const items = alfy.inputMatches(videos, 'snippet.title').map((video) =>
    createItem(
      video.snippet.title,
      video.snippet.channelTitle,
      `https://www.youtube.com/watch?v=${video.id}`
    )
  );

  alfy.output(items);
})();
