import Url from '../url.js'
import { request } from '../request.js'

// 手机号密码登录
export function getUserPlayList(uid) {
  return request({
    method: 'GET',
    url: Url.GET_USER_PLAYLIST + '?uid=' + uid
  })
}
