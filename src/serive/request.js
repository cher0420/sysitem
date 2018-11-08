import $ from 'jquery'
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
        // const data = {
        //   Token:'8f24399bc33744f43a59e0be5ebe42ecc042417e047b9c784999954ac776f56b'
        // }
        // var xdr = new XDomainRequest();
        // xdr.contentType = 'application/json; charset=utf-8'
        // xdr.open("POST", "https://hightalkssoapi-test.azurewebsites.net/api/Tenant/ValidateToken");
        // xdr.onload = function (ev) {
        //   console.log('XDomainRequest',ev.responseText)
        // }
        // xdr.onerror = function (v) { console.log(v)}
        // xdr.ontimeout = function () {}
        // xdr.onprogress = function () {}
        // xdr.send(encodeURI(JSON.stringify(data)));
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

            // alert('error'+res)
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
                  alert('没有权限')
                  // return response.json()
                  // redirect(LOGIN)
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
