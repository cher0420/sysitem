import $ from 'jquery'
$.support.cors = true;
export const isIE9 = () => {
  if(!-[1,]){
    return true;
  }else{
    if(navigator.userAgent.indexOf('MSIE 9.0')>0){
      return true;
    }else{
      return false;
    }
  }
}
export const requestJSONP = (api,params = {}) => {
      const headers = {
        "Content-Type": "application/json; charset=utf-8",
        ...params.headers
      }
      const type = params.method
      const data = params.body||{}
      console.log('.....',data)
      return new Promise(
        (resolve, reject) => {
          $.ajax({
            url:api,
            headers,
            type,
            data,
            success: function(res){
              if(res.Status){
                return resolve(res)
              }else{
                return reject(res)
              }
            },
            error: function(res){
              return reject(res)
            }
          })
        }
      )
  }
export const request = (api,params = {}) => {
  const status = isIE9()
  if(status){
    const headers = {
      "Content-Type": "application/json; charset=utf-8",
      ...params.headers
    }
    const type = params.method
    const data = params.body||{}
    return new Promise(
      (resolve, reject) => {
        jQuery.ajax({
          url:api,
          headers,
          type,
          data,
          success: function(res){
            if(res.Status){
              return resolve(res)
            }else{
              return reject(res)
            }
          },
          error: function(res){
            return reject(res)
          }
        })
      }
    )
  }else{
    if(status){
      const headers = {
        ...params.headers,
        "Content-Type": "application/json; charset=utf-8",
      }
      const type = params.method
      const data = params.body||{}
      return new Promise(
        (resolve, reject) => {
          jQuery.ajax({
            url:api,
            headers,
            type,
            data,
            success: function(res){
              if(res.Status){
                return resolve(res)
              }else{
                return reject(res)
              }
            },
            error: function(res){
              return reject(res)
            }
          })
        }
      )
    }else{
      return new Promise(
        (resolve, reject) =>{
          fetch(api, {
            ...params,
            headers: {
              ...params.headers,
              "Content-Type": "application/json; charset=utf-8",
            },
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
  }
}
