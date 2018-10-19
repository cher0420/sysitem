import {request} from "./request";
import store from '../store/index'
import {REPLACE} from "../store/mutations";
import {getCookies} from "../utils/cookie";
import {TOKEN} from "../constants/constants";

const app = store.state.app

export async function getList(api,params,key){
  const token = getCookies(TOKEN)
  if(token){
    store.dispatch(REPLACE,{loading: true}).then(
      () => {
        const data = {
          PageIndex: 1,                                     //分页页数
          PageSize: 10,                                     //当前页的条数
          ...params.body,
        }
        const body = JSON.stringify(data)
        const options = {
          method: 'POST',
          headers:{
            "Content-Type": "application/json; charset=utf-8",
            'Access-Token':token
          },
          body,
        }
        request(api,options).then(
          (res) => {
            store.dispatch(REPLACE,{loading:false})
            const newData = res[key]
            if(newData.length>0){
              for(let v of newData){
                const arr = v.CreateDate.split(' ')[0].split('/')
                const item = arr[arr.length-1]
                arr.unshift(item)
                arr.pop()
                v.CreateDate = arr.join('-')
                //0:创建 1: 配置 删除 2：创建中 3：删除
                switch(v.Status)
                {
                  case 0:
                    v.config = 0
                    break;
                  case 1:
                    v.config = 1
                    break;
                  case 2:
                    v.config = 2
                    break;
                  case 5:
                    v.config = 2
                    break;
                  case 6:
                    v.config = 2
                    break;
                  default:
                    v.config = 3
                }
              }
            }
            store.dispatch(REPLACE,{tableData: newData,total:res.TotalCount})
          }
        ).catch(
          (err) =>{
            console.log(err);
          }
        )
      }
    )
  }
}

