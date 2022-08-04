import Url from './url.js';
import { request } from './request.js'

export function getSearchHot() {
  return request({
    method: 'GET',
    url: Url.GET_SEARCH_HOT
  })
}

export function search(keywords, offset) {
  return request({
    method: 'GET',
    url: Url.SEARCH + '?keywords=' + keywords + '&offset=' + offset
  })
}