/*知识回答获取列表*/
import {request} from "../../../../serive/request";
import {TOKEN} from "../../../../constants/constants";
import {getCookies} from "../../../../utils/cookie";

export async function getList(api,params,key){
  const token = getCookies(TOKEN)
  const options = {
    method: 'POST',
    headers:{
      'Access-Token':token,
    },
    ...params
  }
  return new Promise(
    (resolve, reject) =>{
      request(api,options).then(
        (res) =>{
          resolve(res[key])
        }
      ).catch(
        (err) =>{
          reject(err[key])
        }
      )
    }
  )
}
