import Url from './url.js';
import { request } from './request.js'

// 自动带上浏览器cookie

/* 获取歌曲url
*  @params id 歌曲id 可传入多个
*/
export function getSongUrl(ids) {
  return request({
    method: 'GET',
    url: Url.GET_SONG_URL + '?id=' + ids
  })
}

/* 获取歌曲详情
*  @params id 歌曲id 可传入多个
*/
export function getSongDetail(id) {
  return request({
    method: 'GET',
    url: Url.GET_SONG_DETIAL + '?ids=' + id
  })
}

/* 获取歌曲歌词
*  @params id 歌曲id
*/
export function getLyric(id) {
  return request({
    method: 'GET',
    url: Url.GET_SONG_LYRIC + '?id=' + id
  })
}