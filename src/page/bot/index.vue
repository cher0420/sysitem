<template>
  <section class="yoy-main">
    <section class="search box-sizing">
      <el-input class='' size = 'small' v-model="keyWords" placeholder="搜索机器人名称或描述" @keyup.enter.native="search"><i slot="suffix" class="el-input__icon el-icon-search yoy-search-button" @click="search"></i>
      </el-input></section>
    <el-table
      v-loading="loading"
      class="margin-top20"
      :data="tableData"
      border
      stripe
      row-key="RecordId"
    >
      <el-table-column
        prop="AliasName"
        label="机器人名称"
      >
      </el-table-column>
      <el-table-column
        prop="Description"
        label="描述"
        min-width="220"
      >
      </el-table-column>
      <el-table-column
        prop="StatusString"
        label="状态"
        :render-header="renderProductId"
        min-width="40"
      >
        <template slot-scope="scope">
          <span :style="{'color': scope.row.StatusString === '已创建'? '#555':'#999'}">
            {{ scope.row.StatusString }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="CreateDate"
        label="创建时间"
        min-width="40"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.Status == 0||scope.row.Status == 1||scope.row.Status == 6">
            -
          </span>
          <span v-else>
            {{scope.row.CreateDate}}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="230"
      >
        <template slot-scope="scope">
          <span class="yoy-list-todo c555">
            <span v-if="scope.row.Status == 2||scope.row.Status == 5">
              <span class="config">
                <i class="el-icon-setting"></i>
                <a href="javascript:;" class="c555" @click="go('/bot/config',scope.row.RecordId)">配置</a>
              </span>
              <span class="del">
                <i class="el-icon-delete"></i>
                <a href="javascript:;" class="c555" @click="del(scope.$index,scope.row)">删除</a>
              </span>
            </span>
            <span class="yoy-botList-create" v-else-if="scope.row.Status==1">
              <span class="primary-color">
                <i class="el-icon-refresh rotate360" ></i>
                <span class="creating">创建中...</span>
                <span class="wait">（ 预计需要三分钟 ）</span>
              </span>
            </span>
            <span class="yoy-botList-create" v-else-if="scope.row.Status==3">
              <span class="danger-color">
                <i class="el-icon-refresh rotate360" ></i>
                <span class="creating">删除中...</span>
                <span class="wait">（ 预计需要三分钟 ）</span>
              </span>
            </span>
            <span v-else class="create" v-else-if="scope.row.Status==0||scope.row.Status">
                <i class="el-icon-plus"></i>
                <a href="javascript:;" class="c555" @click="create(scope.$index,scope.row)">创建</a>
              </span>
          </span>
        </template>
      </el-table-column>
    </el-table>
    <section class="p-relative">
      <el-pagination
        @current-change="handleCurrentChange"
        class="pagination p-absolute"
        background
        layout="total, prev, pager, next"
        :total="total"
        :current-page.sync="PageIndex"
      >
      </el-pagination>
    </section>
  </section>
</template>
<script>
  import DrapDown from '../../components/DrapDown'
  import {BOTLIST,ITEMKEY} from './constants'
  import URL from '../../host/baseUrl'
  import {BOT,DELETEBOT,CREATEBOT} from '../../constants/api'
  import {REPLACE} from "../../store/mutations";
  import {request} from "../../serive/request";
  import store from '../../store/index'
  import {getCookies} from "../../utils/cookie";
  import {TOKEN} from "../../constants/constants";
  import {getList,wait} from "../../serive/requestMethod";

  let  reloadListObj=null
  async function reloadList(v){
    const PageIndex = store.state.app.PageIndex
    const description = store.state.app.description
    const searchStatus = store.state.app.searchStatus
    const options = {
      body:{
        PageIndex,
        description,
        searchStatus
      }
    }
    getList(URL.requestHost + BOT,options,ITEMKEY,false).then(
      () =>{
      }
    ).catch(
      ()=>{

      }
    )
  }

  export default {
    data() {
      return {
        status: BOTLIST.status,
      }
    },
    computed:{
      tableData(){
        return store.state.app.tableData
      },
      loading(){
        return store.state.app.loading
      },
      total(){
        return store.state.app.total
      },
      PageIndex(){
        return store.state.app.PageIndex
      }
    },
    components:{
      DrapDown,
    },
    created(){
      store.dispatch(REPLACE,{PageIndex:1,searchStatus:null,description:null}).then(
        ()=>{
          wait(getList(URL.requestHost + BOT,{},ITEMKEY,false)).then(
            () =>{
              reloadListObj = setInterval(reloadList,10000)
            }
          )
        }
      ).catch(err=>err)
    },
    destroyed: function () {
      clearInterval(reloadListObj)
    },
    methods:{
      go(path,id){
        const url = {
          path:path,
          query: {
            recordId:id
        }
      }
        const arr = path.split('/')
        const index=arr[arr.length-1]
        const config = this.$route.name === 'config'
        store.dispatch(REPLACE,{navIndex:index,config}).then(
          () =>{
            this.$router.push(url)
          }
        )
      },
      renderProductId(h, {column}) {
        return h(DrapDown,{
              props: {
                options: BOTLIST.status,
              },
          }
        );
      },
      change(val) {
        console.log(val);
      },
      create(k,row){
        this.$confirm('确认创建机器人？', '警告！', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.add(k,row)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消创建'
          });
        });
      }
      ,
      add(k,row){
        const that = this
        const token = getCookies(TOKEN)
        let obj = JSON.parse(JSON.stringify(row))
        let newObj = {...obj,Status:1}
        const tableData = store.state.app.tableData
        tableData.splice(k,1,newObj)
        store.dispatch(REPLACE,{tableData:tableData})
        const userInfo = store.state.app.userInfo
        const data = {
          botId:row.RecordId,
          alias:row.AliasName,
          description:row.Description,
          botType:row.BotType,
          deployModel:row.DeployModel,   //alone : share
          UserInfo:{
            Email:userInfo.Email,
            FullName:userInfo.FullName,
            TenantDomainName:userInfo.TenantDomainName
          }
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
        request(URL.requestHost+CREATEBOT,options).then(
          (res) => {
            reloadList().then(
              () =>{
                that.$message({
                  type: 'success',
                  message: '创建中，请稍后',
                  duration: 2000,
                });
              }
            )
          }
        ).catch(
          (err)=>{
            that.$message({
              type: 'error',
              message: '操作失败',
              duration: 2000
            });
          }
        )
      },
      del(k,row) {
        this.$confirm('删除操作将永久删除机器人，是否继续?', '警告！', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.delItem(row)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      delItem(row){
        const that = this
        const userInfo = store.state.app.userInfo
        const data = {
          botId:row.RecordId,
          regName:row.AliasName,
          luisAppId:row.LuisAppId,
          botType:row.BotType,
          deployModel:row.DeployModel,   //alone : share
          UserInfo:{
            Email:userInfo.Email,
            FullName:userInfo.FullName,
            TenantDomainName:userInfo.TenantDomainName
          }
        }
        const body = JSON.stringify(data)
        const token = getCookies(TOKEN)
        const options = {
          method: 'POST',
          headers:{
            "Content-Type": "application/json; charset=utf-8",
            'Access-Token':token
          },
          body,
        }
        request(URL.requestHost + DELETEBOT,options).then(
          (res)=>{
            reloadList().then(
              () =>{
                that.$message({
                  type: 'success',
                  message: '操作成功！'
                });
              }
            )
          }
        ).catch(
          (res)=>{
            that.$message({
              type: 'error',
              message: '操作失败，请稍后再试！'
            });
          }
        )
      },
      handleCurrentChange(v){
        store.dispatch(REPLACE,{PageIndex:v}).then(
          () =>{
            const PageIndex = store.state.app.PageIndex
            const searchStatus = store.state.app.searchStatus
            const options = {
              body:{
                PageIndex: PageIndex,
                description: this.keyWords,
                searchStatus: searchStatus
              }
            }
            getList(URL.requestHost + BOT,options,ITEMKEY).then(
              () =>{
                console.log('获取列表了')
              }
            )
          }
        )
      },
      search(){
        const that = this
        const description = this.keyWords
        const searchStatus = store.state.app.searchStatus
        store.dispatch(REPLACE,{PageIndex:1,description}).then(
          () =>{
            const options={
              body:{
                description,
                searchStatus,
              }
            }
            getList(URL.requestHost + BOT,options,ITEMKEY).then(
              ()=>{
                console.log('获取列表')
              }
            )
          }
        )
      },
      update(v){
        this.data = {
          ...this.data,
          ...v
        }
      }
    }
  }
</script>
<style lang="scss">
  @import '../../style/index';
  .yoy-search-button{
    width: 32px;
    height:30px;
    margin-top:1px;
    margin-right: 1px;
    background-color: $light-blue;
  }
  .yoy-search-button:hover{
    cursor:pointer;
  }

  .search{
    width: 360px;
    height: 32px;
  }
  .el-icon-search:before {
    font-weight: 900;
    font-size: 14px;
    color: $primary-color;
  }
  /*
  size
   */
  .margin-top20{
    margin-top: 20px;
  }
  .pagination{
    left: 50%;
    top: 40px;
    transform: translateX(-50%);
  }
  .yoy-list-todo{
    a{
      text-underline: none;
    }
  }
  .create:hover{
    a,i,span{
      color: $primary-color;
    }
  }
  .del{
    margin-left:14px;
  }
  .del:hover{
    a,i,span{
      color: $danger;
    }
  }
  .config:hover{
    a,i,span{
      color: $primary-color;
    }
  }
  .wait{
    opacity: .6;
  }
  .rotate360{
    -webkit-transition-property: -webkit-transform;
    -webkit-transition-duration: 1s;
    -moz-transition-property: -moz-transform;
    -moz-transition-duration: 1s;
    -webkit-animation: rotate 3s linear infinite;
    -moz-animation: rotate 3s linear infinite;
    -o-animation: rotate 3s linear infinite;
    animation: rotate 3s linear infinite;
  }
  @-webkit-keyframes rotate{from{-webkit-transform: rotate(0deg)}
    to{-webkit-transform: rotate(360deg)}
  }
  @-moz-keyframes rotate{from{-moz-transform: rotate(0deg)}
    to{-moz-transform: rotate(359deg)}
  }
  @-o-keyframes rotate{from{-o-transform: rotate(0deg)}
    to{-o-transform: rotate(359deg)}
  }
  @keyframes rotate{from{transform: rotate(0deg)}
    to{transform: rotate(359deg)}
  }
</style>
