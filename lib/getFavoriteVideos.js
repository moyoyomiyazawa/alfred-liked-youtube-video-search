'use strict';

const alfy = require('alfy');
const { google } = require('googleapis');

async function getFavoriteVideos(auth) {
  const youtube = google.youtube('v3');

  let videos = alfy.cache.get('videos') || [];
  // キャッシュがなかったら再取得
  if (!videos.length) {
    const res = await youtube.videos.list({
      auth: auth,
      part: 'id',
      myRating: 'like',
      maxResults: 1,
    });

    const maxResults = 50;
    const totalCount = Math.ceil(
      parseInt(res.data.pageInfo.totalResults) / maxResults
    );

    let pageToken = '';
    for (let i = 0; i < totalCount - 1; i++) {
      const res = await youtube.videos.list({
        auth: auth,
        part: 'snippet',
        myRating: 'like',
        maxResults: maxResults,
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
