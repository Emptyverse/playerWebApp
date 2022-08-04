export function getLoginToken() {
  return document.cookie.indexOf('__remember_me') > -1 && document.cookie.indexOf('MUSIC_U') > -1
}
