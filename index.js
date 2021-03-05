'use strict';

const alfy = require('alfy');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const createItem = require('./lib/createItem');

const getAuthorizedClient = require('./lib/getAuthorizedClient');
const getFavoriteVideos = require('./lib/getFavoriteVideos');

const scopes = ['https://www.googleapis.com/auth/youtube.readonly'];
const tokenPath = __dirname + '/' + 'alfred-youtube-search.json';
const authorizationCode = process.env.AUTHORIZATION_CODE;
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

const oauth2Client = new OAuth2(clientId, clientSecret, 'urn:ietf:wg:oauth:2.0:oob');

// TODO: 細かい動作をリファクタリングする
(async () => {
  // TODO: キャッシュがある場合は認証をスルーする
  const auth = await getAuthorizedClient(oauth2Client, tokenPath, authorizationCode, scopes);
  const videos = await getFavoriteVideos(auth);

  const items = alfy.inputMatches(videos, 'snippet.title').map((video) =>
    createItem(
      video.snippet.title,
      video.snippet.channelTitle,
      `https://www.youtube.com/watch?v=${video.id}`
    )
  );

  alfy.output(items);

  // TODO: インクリメンタルサーチを実装する（なぜかalfy.inputが取得できないので調査する）
})();
