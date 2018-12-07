import {request} from "../../../../serive/request";
import {getCookies} from "../../../../utils/cookie";
import {TOKEN} from "../../../../constants/constants";
import URL from '../../../../host/baseUrl';
import {DELETEQUESTION, QUICKLYLIST,QUERYSTATUS} from "../../../../constants/api";
import route from '../../../../router/index'
import store from '../../../../store/index'
import {REPLACE} from "../../../../store/mutations";
import moment from 'moment';

/*
机器人id
*/

export const getList  = (params) =>{

    /*
    无参数情况下请求数据初始化
     */
  const id = JSON.parse(sessionStorage.getItem('recordId'))
  const BotConfigId = id?id:route.currentRoute.query.recordId
  const token = getCookies(TOKEN)

  const body = {
    BotConfigId,
    PageSize:50,
    PageIndex:1,
    Keys:null,
    Status:null,
    ...params,
  }

  const option = {
    headers: {
      'Access-Token': token,
    },
    method:'POST',
    body:JSON.stringify(body)
  }
  return new Promise(
    (resolve,reject) =>{
      const url = URL.requestHost+QUICKLYLIST
      request(url,option).then(
        (res)=> {
          const data = res['Data']
          /*
          1、分页为50，
          2、将已发布的状态默认勾选
          3、初始化时需判断当前是否有培训中或者发布中的状态,有做loading,禁止用户操作
          4、页面操作后也要进行判断
           */
          if(data&&data.length>0){
            data.forEach(
              (v,index) => {
                switch (v.Status) {
                  case 4:
                    store.dispatch(REPLACE,{mainLoading:true})
                    break;
                  case 2:
                    store.dispatch(REPLACE,{mainLoading:true})
                    break;
                  case 3:
                    v.checkedStatus = true;
                    break;
                  case 5:
                    v.checkedStatus = true;
                    break;
                  default:
                    v.checkedStatus = false;
                }
                /*
                  1、更改日期格式 12(月)/3(日)/2018(年) 3:57:14 AM => 2018-3-12
                */
                v.CreateDate = moment(v.CreateDate).format('YYYY-MM-DD')
              }
            )
          }

          resolve(res)
        }
      ).catch(
        (err) =>{
          reject(err)
        }
      )
    }
  )
}
export const del = (params) => {
  const token = getCookies(TOKEN)

  const option = {
    headers: {
      'Access-Token':token
    },
    method: 'POST',
    body:JSON.stringify(params)
  }
  return new Promise(
    (resolve,reject) => {
      const url = URL.requestHost+DELETEQUESTION
      request(url,option).then(
        (res) => {
          resolve(res)
        }
      ).catch(
        (err) =>{
          reject(err)
        }
      )
    }
  )
}

export const _ask = () => {
  const token = getCookies(TOKEN)
  const id = JSON.parse(sessionStorage.getItem('recordId'))
  const BotConfigId = id?id:route.currentRoute.query.recordId
  const params = {
    headers:{
      'Access-Token':token
    },
    method:'POST',
    body:JSON.stringify({BotConfigId}),
  }
  return new Promise(
    (resolve,reject) => {
      request(URL.requestHost+QUERYSTATUS,params).then(
        (res) =>{
          if(res.Data){
            /*
            如果res.Data结果为true,存在培训中或者发布中的数据
             */
            reject(res)
          }else{
            /*
            false:不存在培训中或者发布中的数据
             */
            resolve (res)
          }
        }
      ).catch(
        // () =>{
        //     const id = BotConfigId
        //     const host = 'https://'+window.location.host
        //     const url = `${host}/WebTalk/Index.html?id=${id}`
        //     window.open(url)
        // }
      )
    }
  )
}
export const doSomething = (url,params) =>{
  const id = JSON.parse(sessionStorage.getItem('recordId'))
  const BotConfigId = id?id:route.currentRoute.query.recordId
  const token = getCookies(TOKEN)
  const body = {
    ...params,
    BotConfigId
  }
  const options = {
    headers:{'Access-Token':token},
    method:'POST',
    body:JSON.stringify(body)
  }
  return new Promise(
    (resolve,reject) =>{
      request(url,options).then(
        (res) =>{
          resolve(res)
        }
      ).catch(
        (err) =>{
          reject(err)
        }
      )
    }
  )
}
