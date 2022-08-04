import Url from './url.js'
import { request } from './request.js'

export function getRankList() {
  return request({
    method: 'GET',
    url: Url.GET_RANK_LIST
  })
}

export function getPlayListDetail(id) {
  return request({
    method: 'GET',
    url: Url.GET_PLAY_LIST_DETAIL + '?id=' + id
  })
}