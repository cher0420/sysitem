<template>
  <el-dropdown @command="handleCommand" placement="bottom-start">
  <span class="el-dropdown-link c333">
    {{title}}<i class="el-icon-arrow-down el-icon--right"></i>
  </span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item :command="key" v-for="(value, key, index) in options">{{value}}</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
  import {request} from "../serive/request";
  import {getCookies} from "../utils/cookie";
  import {TOKEN} from "../constants/constants";
  import store from '../store/index'
  import {REPLACE} from "../store/mutations";
  import {BOT} from "../constants/api";
  import {ITEMKEY} from "../page/bot/constants";
  import URL from '../host/baseUrl'
  import {BOTLIST} from "../page/bot/constants";
  import {getList} from "../page/bot/service/requestMethod";

  export default {
    data(){
      return{
        title:'状态'
      }
    },
    props: {
      tableData:{
        type: Array,
        default: [],
      },
      total:{
        type: Number,
        default:0,
      },
      keyWords:{
        type: String
      },
      filterStatus: {
        type: Number,
        default: 0,
      },
      options: {
        type: Array,
        default: []
      },
      PageIndex:{
        type:Number,
        async: true,
      }
    },
    name: "DrapDown.vue",
    methods: {
      handleCommand(command) {
        const that = this
        store.dispatch(REPLACE,{searchStatus:command-0,PageIndex:1}).then(
          () =>{
            const searchStatus = store.state.app.searchStatus
            const description = store.state.app.description
            that.title = BOTLIST.status[command]
            const options={
              body:{
                description,
                searchStatus,
              }
            }
            getList(URL.requestHost + BOT,options,ITEMKEY).then(
              ()=>{
                store.dispatch(REPLACE,{ PageIndex: 1 })
              }
            )
          }
        )
      },
      getList(api, params, key) {
        const token = getCookies(TOKEN)
        if (token) {
          store.dispatch(REPLACE, {loading: true}).then(
            () => {
              const data = {
                PageIndex: 1,                                     //分页页数
                PageSize: 10,                                     //当前页的条数
                ...params.body,
              }
              const body = JSON.stringify(data)
              const options = {
                method: 'POST',
                headers: {
                  "Content-Type": "application/json; charset=utf-8",
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
                  // cher 测试
                  // this.tableData = newData
                }
              ).catch(
                (err) => {
                  console.log(err);
                }
              )
            }
          )
        }
      }
    }
  }
</script>

<style lang="scss">
@import '../style/index';
.el-table th > .cell .el-dropdown{
  height:30px;
  line-height: 30px;
}
</style>
