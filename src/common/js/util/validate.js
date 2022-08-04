// 验证手机格式是否正确
export const isPhoneNumber = function (phoneNumber) {
  if (!phoneNumber) return false;
  let reg = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/;
  return reg.test(phoneNumber);
}

// 验证昵称是否正确，4-30位，由中文数字字母 - _组成
export const validateNickName = function (nickname) {
  // if (!nickname) return false;
  let reg = /^[\u4E00-\u9FA5A-Za-z0-9_-]{4,30}$/;
  return reg.test(nickname);
}

/* 验证密码格式是否正确
 * 1、不能含有空格
 * 2、含有数字、字母、符号 至少两种
 * 3、8-20 位
*/
export const validatePassword = function (password) {
  if (!password) return false;
  let reg = /(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^[^\s\u4e00-\u9fa5]{8,20}$/;
  return reg.test(password);
}

// 验证手机验证码
export const validateVerificationCode = function (code) {
  if (!code) return false;
  let reg = /^\d{4}$/;
  return reg.test(code);
}