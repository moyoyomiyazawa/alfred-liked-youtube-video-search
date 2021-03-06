'use strict';

const alfy = require('alfy');
const { google } = require('googleapis');

async function getFavoriteVideos(auth) {
  // 高評価した動画総数を取得
  const youtube = google.youtube('v3');
  const res = await youtube.videos.list({
    auth: auth,
    part: 'id',
    myRating: 'like',
  });
  const maxResults = 50;
  const totalCount = Math.ceil(
    parseInt(res.data.pageInfo.totalResults) / maxResults
  );

  // 高評価した動画をすべて取得
  // APIの仕様上、1回のリクエストで50個までしか取得できないので、
  // 全ての動画が取得できるまで繰り返しリクエストします
  let videos = [];
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

  return videos;
}

module.exports = getFavoriteVideos;
