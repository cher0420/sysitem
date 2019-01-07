import {request} from "../../../../serive/request";
import {getCookies} from "../../../../utils/cookie";
import {TOKEN} from "../../../../constants/constants";

export async function handleDetail (api,params,key){
    const token = getCookies(TOKEN)
    const options = {
      method:'POST',
      headers:{
        'Access-Token':token
      },
      ...params
    }
    return new Promise(
      (resolve,reject) =>{
        request(api,options,key).then(
          (res) => {
            resolve(res[key])
          }
        ).catch(
          (err) => {
            reject(err)
          }
        )
      }
    )
}

export async function updateDetail (){

}
