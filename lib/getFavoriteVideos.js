'use strict';

const alfy = require('alfy');
const { google } = require('googleapis');

async function getFavoriteVideos(auth) {
  const youtube = google.youtube('v3');

  let videos = alfy.cache.get('videos') || [];
  let pageToken = '';
  // キャッシュがなかったら再取得
  if (!videos.length) {
    for (let i = 0; i < 20; i++) {
      const res = await youtube.videos.list({
        auth: auth,
        part: 'snippet',
        myRating: 'like',
        maxResults: 50,
        pageToken,
      });
      videos.push(...res.data.items);
      pageToken = res.data.nextPageToken;
    }
    // キャッシュにセット（1時間で消滅）
    alfy.cache.set('videos', videos, { maxAge: 3600000 });
    return videos;
  }

  return videos;
}

module.exports = getFavoriteVideos;
