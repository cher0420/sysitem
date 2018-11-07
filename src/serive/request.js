import $ from 'jquery'
$.support.cors = true;
import {redirect} from "../permissions/permissions";
import {LOGIN} from "../constants/api";

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
export const IE9Request = (api,params) => {
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    ...params.headers
  }
  const type = params.method
  const data = params.body||{}
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
    return IE9Request(api,params)
  }else{
    if(status){
      return IE9Request(api,params)
    }else{
      return new Promise(
        (resolve, reject) =>{
          const headers = {...params.headers,"Content-Type": "application/json; charset=utf-8"}
          const body = params.body
          const method = params.method||"GET"
          fetch(api, {
            headers,
            body,
            method
          }).then(
            (response) =>{
              switch (response.status) {
                case 200:
                  return response.json()
                case 401:
                  redirect(LOGIN)
                  break;
                default:
                alert('00000000')
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
