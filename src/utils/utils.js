import {isIE9} from "../serive/request";

export function unhtml (str) {
  return str ? str.replace(/[<">']/g, (a) => {
    return {
      '<': '&lt;',
      '"': '&quot;',
      '>': '&gt;',
      "'": '&#39;'
    }[a]
  }) : ''
}
export function htmlDecodeByRegExp (str) {
  let s = ''
  if (str.length === 0) return ''
  s = str.replace(/&amp;/g, '&')
  s = s.replace(/&lt;/g, '<')
  s = s.replace(/&gt;/g, '>')
  s = s.replace(/&nbsp;/g, ' ')
  s = s.replace(/&#39;/g, "\'")
  s = s.replace(/&quot;/g, '"')
  return s
}

/**
 * 数组去重
 * @param array
 * @return {Array}
 */
function uniq(array){
  const temp = []; //一个新的临时数组
  for(let i = 0; i < array.length; i++){
    if(temp.indexOf(array[i]) == -1){
      temp.push(array[i]);
    }
  }
  return temp;
}


