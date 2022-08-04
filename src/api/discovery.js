import Url from './url.js'
import { request } from './request.js'

// 获取首页banner
export function getBanner() {
  return request({
      method: 'GET',
      url: '/banner'
  })
}

// 获取首页icon
export function getDragonBall() {
  return request({
    method: 'GET',
    url: Url.GET_DRAGON_BALL
  })
}

// 获取推荐歌单
export function getPersonalized(limit) {
  return request({
    method: 'GET',
    url: limit ? Url.GET_PERSONALIZED + '?limit=' + limit : Url.GET_PERSONALIZED
  })
}

// 获取最新专辑
export function getAlbum() {
  return request({
    method: 'GET',
    url: Url.GET_ALBUM
  })
}

// 获取日推歌曲
export function getRecommendSongs() {
  return request({
    method: 'GET',
    url: Url.GET_RECOMMEND_SONGS
  })
}