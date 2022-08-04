import Url from './url.js'
import { request } from './request.js'

/* 获取热门歌手
*  limit: 取出数量 , 默认为 50
*/
export function getTopArtists(limit) {
  return request({
    method: 'GET',
    url: limit ? Url.GET_TOP_ARTISTS + '?limit=' + limit : Url.GET_TOP_ARTISTS
  })
}

/* 获取歌手详情
*  必选参数 : id: 歌手 id
*/

export function getSingerDetail(id) {
  return request({
    method: 'GET',
    url: Url.GET_SINGER_DETAIL + '?id=' + id
  })
}