import $ from 'jquery'
import {redirect} from "../permissions/permissions";
import {LOGIN} from "../constants/api";
import store from "../store";
import {REPLACE} from "../store/mutations";

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
  store.dispatch(REPLACE, {mainLoading: true})
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
                alert('00000000')
              }
            }
          ).then(
            (res)=>{
              if (res.Status) {
                store.dispatch(REPLACE, {mainLoading: false}).then(
                  ()=>{
                    resolve(res)
                  }
                )
              } else {
                store.dispatch(REPLACE, {mainLoading: false}).then(
                  ()=> {
                    reject(res)
                  })
              }
            }
          ).catch(
            (err)=>{
              store.dispatch(REPLACE, {mainLoading: false}).then(
                ()=> {
                  reject(err)
                })
            }
          )
        }
      )
    }
  }
}
