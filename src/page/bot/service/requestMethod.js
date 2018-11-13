import {request} from "../../../serive/request";
import store from '../../../store/index'
import {REPLACE} from "../../../store/mutations";
import {getCookies} from "../../../utils/cookie";
import {TOKEN,TENANTID} from "../../../constants/constants";
import URL from '../../../host/baseUrl'
import {UPDATESTATUS} from "../../../constants/api";

const token = getCookies(TOKEN)

// export async function wait(callback){
//     let reload = setInterval(function () {
//       const TenantId = getCookies(TENANTID);
//       if(TenantId){
//         clearInterval(reload);
//         callback
//       }
//     },50)
// }

export async function getList(api,params,key, loading=true){

    const TenantId = getCookies(TENANTID)

    store.dispatch(REPLACE, {loading: loading}).then(
      () => {
        const data = {
          PageIndex: 1,                                     //分页页数
          PageSize: 10,                                     //当前页的条数
          tenantId:TenantId,
          ...params.body,
        }
        const body = JSON.stringify(data)
        const options = {
          method: 'POST',
          headers: {
            'Access-Token': token
          },
          body,
        }
        request(api, options).then(
          (res) => {
            store.dispatch(REPLACE, {loading: false})
            const newData = res[key]
            if (newData.length > 0) {
              for (let v of newData) {
                const arr = v.CreateDate.split(' ')[0].split('/')
                const item = arr[arr.length - 1]
                arr.unshift(item)
                arr.pop()
                v.CreateDate = arr.join('-')
                //0:创建 1: 配置 删除 2：创建中 3：删除
                switch (v.Status) {
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
            store.dispatch(REPLACE, {tableData: newData, total: res.TotalCount}).then(
              () =>{
                const answer = filterData(newData)
                if(answer.length>0){
                  reload(answer)
                }
              }
            )
          }
        ).catch(
          (err) => {
            console.log(err);
          }
        )
      }
    )
}

let copyArr = [] //需对比数据
let reloadListObj = {}
export const filterData = (originalData)=>{
  /*
  排列顺序(0: 未创建, 1：创建中, 2：已创建, 3：删除中, 4: 已删除, 5: 删除失败, 6：创建失败)
   */
  const arr = []
  originalData.forEach((e)=> {
    if(e.Status ===1 || e.Status ===3){
      arr.push(e.RecordId)
    }
  });
  return arr
}
export function reload (arr){
  let reload = setInterval(function () {
    if(arr.length === 0){
      clearInterval(reload);
    }else{
      askIsDoing(arr)
    }
  },3000)
}
export function askIsDoing(arr) {
  const body = {
    BotIds:arr
  }
  const options = {
    method:'POST',
    headers: {
      'Access-Token': token
    },
    body: JSON.stringify(body)
  }
  request(URL.requestHost+UPDATESTATUS,options).then(
    (v) =>{
      //2、遍历data
      //3、找出正在删除或者正在创建的数据
      // resData 数据格式 {ID: "824ffc5e-95fe-482f-91c5-5db61f4e8f80",Status: "3"}
      // let resData = v['BotStatusList']
      // console.log('调用了',resData)
      const resData = [{ID: "824ffc5e-95fe-482f-91c5-5db61f4e8f80", Status: "1"},
      {ID: "8cae8a3c-fdf6-4c78-ad63-bf44af7c6635", Status: "6"},
      {ID: "b819c8e4-7aea-4b3f-b81e-ac4281d4d581", Status: "0"},
      {ID: "eac4f4cc-33dd-475d-879e-cd9fe036ff4b", Status: "1"}]
      //深拷贝resData
      copyArr = JSON.parse(JSON.stringify(resData))
      const replaceArr = []
      copyArr.forEach(
        (v,index,arr) => {
          switch (v.Status) {
            case '0':
              replaceArr.push(v)
              break;
            case '2':
              replaceArr.push(v)
              break;
            case '4':
              replaceArr.push(v)
              break;
            case '5':
              replaceArr.push(v)
              break;
            case '6':
              replaceArr.push(v)
              break;
          }
        }
      )
      const tableData = store.state.app.tableData
      replaceArr.forEach(
        (v,index,arr) =>{
          tableData.forEach(
            (value,index) =>{
              if(v.ID == value.RecordId){
                value.Status = v.Status-0
              }
            }
          )
        }
      )
      store.dispatch(REPLACE,{tableData}).then(
        () => {
          // console.log(store.state.app.tableData)
        }
      )
      // reloadListObj = setInterval(reloadList,10000)
      //4、组装成一个轮巡数组，询问是否删除
      //5、将每次数组与返回数据做对比
      //6、找出不同的状态的数据，更改页面状态
    }
  )
}

