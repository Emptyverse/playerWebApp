import Url from '../url.js'
import { request } from '../request.js'

export function captchaSent(phone) {
  return request({
    method: 'GET',
    url: Url.CAPTCHA_SENT + "?phone=" + phone
  })
}

export function captchaVerify(phone, captcha) {
  return request({
    method: 'GET',
    url: Url.CAPTCHA_VERIFY + "?phone=" + phone + "&captcha=" + captcha
  })
}