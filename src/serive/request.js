import ElementUI from'element-ui';
import {getCookies, removeCookies} from '../utils/cookie'

export const request =(api, params,) =>{
  const cookie = getCookies('Access-Token')
  const option = params&&params.options&&params.options
  const headers = params&&params.options&&params.header
  return new Promise(
    (resolve, reject) =>{
      fetch(URL.baseUrl + api, {
        ...option,
        headers:{
          'Content-Type': 'application/json; charset=utf-8',
          'Access-Token': cookie,
          ...headers
        }
      }).then(
        (response) =>{
          switch (response.status) {
            case 200:
              return response.json()
            case 401:
              alert('没有权限')
              break
            default:
              // ElementUI.Message({
              //   type: 'error',
              //   message: '服务器错误！',
              //   duration: 1500
              // })
          }
    }
  ).then(
        (res)=>{
          if (res.Status) {
            console.log(res)
          } else {
            reject(res)
          }
        }
      ).catch(
        (err)=>{
          reject(err)
        }
      )
    }
  )
}
