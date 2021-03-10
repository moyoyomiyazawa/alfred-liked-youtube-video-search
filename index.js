'use strict';

const alfy = require('alfy');
const shuffle = require('shuffle-array');
const { google } = require('googleapis');

const createItem = require('./lib/createItem');
const getAuthCode = require('./lib/getAuthCode');
const getAuthorizedClient = require('./lib/getAuthorizedClient');
const getLikedVideos = require('./lib/getLikedVideos');

const scopes = ['https://www.googleapis.com/auth/youtube.readonly'];
const tokenPath = __dirname + '/' + 'alfred-youtube-search.json';
const authorizationCode = process.env.AUTHORIZATION_CODE;
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;


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

  if (alfy.input.length > 1) {
    // キャッシュクリア
    if (alfy.input === '--c') {
      alfy.cache.set('videos', null);
      alfy.output([createItem('Cleared cache.', '', '')]);
      return;
    }

    let videos = alfy.cache.get('videos');
    if (!videos) {
      const auth = await getAuthorizedClient(
        oauth2Client,
        tokenPath,
        authorizationCode
      );
      videos = await getLikedVideos(auth);
      // キャッシュ時間: 30分
      alfy.cache.set('videos', videos, { maxAge: 1800000 });
    }

    const allItems = videos.map((video) =>
      createItem(
        video.snippet.title,
        video.snippet.channelTitle,
        `https://www.youtube.com/watch?v=${video.id}`
      )
    );

    // 全件表示
    if (alfy.input === '--a') {
      alfy.output(allItems);
      return;
    }

    // ランダム表示
    // `--r`のあとに数値を入力すると、その数の分、ランダムな記事を取得して表示する
    if (/^--r/.test(alfy.input)) {
      const result = alfy.input.match(/^--r (\d*)/);
      // 取得件数が未指定なら1件表示
      if (!result) {
        const randomItem = shuffle.pick(allItems);
        alfy.output([randomItem]);
        return;
      }
      // 取得件数の指定があれば、指定数分の要素を取得
      const randomItems = shuffle.pick(allItems, { picks: Number(result[1]) });
      alfy.output(randomItems);
      return;
    }

    // インクリメンタル検索
    const matchedItems = alfy.inputMatches(allItems, 'title');
    if (!matchedItems.length) {
      alfy.output([
        createItem(
          'The requested video was not found. ⚠️',
          'Search for videos on YouTube.',
          `https://www.youtube.com/results?search_query=${alfy.input}`
        ),
      ]);
      return;
    }
    alfy.output(matchedItems);
  } else {
    alfy.output([createItem('Loading...', '', '')]);
  }
})();
