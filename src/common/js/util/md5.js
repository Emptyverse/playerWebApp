import md5 from 'js-md5';

export const encrypt = (data) => {
  if (!data) return false
  return md5(data)
}