<template>
  <el-dropdown @command="handleCommand" placement="bottom-start" class="p-absolute left-0">
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
