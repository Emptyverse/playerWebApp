import Url from '../url.js'
import { request } from '../request.js'

// 手机号密码登录
export function loginCellphone(phone, password) {
  return request({
    method: 'GET',
    url: Url.LOGIN_CELLPHONE + "?phone=" + phone + "&md5_password=" + password
  })
}

// 查看登录状态
export function loginStatus() {
  return request({
    method: 'GET',
    url: Url.LOGIN_STATUS
  })
}

// 退出登录
export function logout() {
  return request({
    method: 'GET',
    url: Url.LOGOUT
  })
}