import {request} from "../../../../serive/request";
import {getCookies} from "../../../../utils/cookie";
import {TOKEN} from "../../../../constants/constants";
import URL from '../../../../host/baseUrl';
import {DELETEQUESTION, GETQUICKLYLIST,PUBLISH,QQADELETE} from "../../../../constants/api";
import route from '../../../../router/index'
import moment from 'moment';
import store from '../../../../store';

export const getList  = (params) =>{

  const id = JSON.parse(sessionStorage.getItem('recordId'))
  // const BotConfigId = id?id:route.currentRoute.query.recordId
  const token = getCookies(TOKEN)
  const TenantId = store.state.app.userInfo.TenantId
  const BotRecordId =  route.currentRoute.query.recordId


  const body = {
    TenantId,
    BotRecordId,
    PageSize:10,
    PageIndex:1,
    KeyWord:'',
    Status:0,
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
      const url = URL.requestHost + GETQUICKLYLIST
      request(url,option).then(
        (res)=> {

          const data = res['Data'].Result
          /*
          1、分页为50，
          2、将已发布的状态默认勾选
          3、初始化时需判断当前是否有培训中或者发布中的状态,有做loading,禁止用户操作
          4、页面操作后也要进行判断
           */



          if(data&&data.length>0){
            this.clearshow=false
            data.forEach(
              (v,index) => {



                switch (v.Status) {
                  case 5:
                    v.checkedStatus = true;

                    break;
                  default:
                    v.checkedStatus = false;
                }
                /*  1、更改日期格式 12(月)/3(日)/2018(年) 3:57:14 AM => 2018-3-12 */
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
  const Ids = [params.QuickQuizId]
  const TenantId = store.state.app.userInfo.TenantId
  const BotRecordId =  route.currentRoute.query.recordId
  const DeleteType = 0


  const body = {
    TenantId,
    BotRecordId,
    Ids,
    DeleteType
  }
  const option = {
    headers: {
      'Access-Token':token
    },
    method: 'POST',
    body:JSON.stringify(body)
  }
  return new Promise(
    (resolve,reject) => {
      const url = URL.requestHost+QQADELETE
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

export const _ask = (botId = null) => {
  const token = getCookies(TOKEN)
  const id = JSON.parse(sessionStorage.getItem('recordId'))
  // const BotConfigId = route.currentRoute.query.recordId?route.currentRoute.query.recordId:id
  const TenantId = store.state.app.userInfo.TenantId
  const BotRecordId =  route.currentRoute.query.recordId


  const params = {
    headers:{
      'Access-Token':token
    },
    method:'POST',
    body:JSON.stringify({TenantId,BotRecordId}),
  }
  return new Promise(
    (resolve,reject) => {
      request(URL.requestHost+PUBLISH,params).then(
        (res) =>{
          if(res.Data === 0){
            console.log('12', '')
            //不存在培训中或者发布中的数据
            //0:正常 1:培训中 2:发布中 3:发布或者培训失败}
            res.recordId = BotConfigId
            resolve (res)

          }else {
            //正在发布或测试
            res.recordId = BotConfigId
            reject(res)
          }
        }
      ).catch(
        err=>err
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
          res.recordId = BotConfigId
          resolve(res)
        }
      ).catch(
        (err) =>{
          err.recordId = BotConfigId
          reject(err)
        }
      )
    }
  )
}
