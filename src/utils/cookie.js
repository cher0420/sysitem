import Cookies from 'js-cookie'
/**
 * 设置cookies
 * @param key
 * @return {string}
 * @param value
 * @return {string}
 * @param option
 * @return {object}
 */
export async function setCookies (key, value, option = null) {
  return Cookies.set(key, value, option)
}

/**
 * 获取cookie
 * @param key
 * @return {string}
 */
export function getCookies (key) {
  return Cookies.get(key)
}

/**
 *
 * @param keyArr
 * @return {Array}
 */
export async function removeCookies (keyArr) {
  if (keyArr instanceof Array) {
    for (let v of keyArr) {
      Cookies.remove(v)
    }
  } else {
    Cookies.remove(keyArr)
  }
}
