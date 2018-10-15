import ElementUI from'element-ui';
import {getCookies, removeCookies} from '../utils/cookie'

export const request =(api, params) =>{
  return new Promise(
    (resolve, reject) =>{
      fetch(api, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        ...params
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
            resolve(res)
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
