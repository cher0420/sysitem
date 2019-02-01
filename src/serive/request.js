import $ from 'jquery'
import {redirect} from "../permissions/permissions";
import {LOGIN} from "../constants/api";
import URL from '../host/baseUrl'
import {IMG_UPLOADORDELETE} from "../constants/api";
import {TOKEN} from "../constants/constants";
import {getCookies} from "../utils/cookie";

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
export const request = (api,params = {}) => {
  const status = isIE9()
  if(status){
    $.support.cors = true;
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
          async:true,
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
              alert('success'+res.Status)
              if(res.Status){
                return resolve(res)
              }else{
                return reject(res)
              }
            },
            error: function(res){
              alert('error'+res.Status)
              return reject(res)
            }
          })
        }
      )
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
                alert('服务器异常，请联系工作人员')
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
export const upload_delete_img = (params) => {
  const token = getCookies(TOKEN)
  const options = {
    method: 'POST',
    headers:{
      'Access-Token':token
    },
    ...params
  }
  return new Promise(
    (resolve,reject) =>{
      request(URL.requestHost+IMG_UPLOADORDELETE,options).then(
        (res) => {
          resolve (res['Data'])
        }
      ).catch(
        (err) =>{
          reject(err['Data'])
        }
      )
    }
  )
}
