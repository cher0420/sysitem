<template>
  <section>
    <section class="search box-sizing f-s-0">
      <el-input class='' size = 'small' v-model="keyWords" placeholder="搜索机器人或描述" @keyup.enter.native="search"><i slot="suffix" class="el-input__icon el-icon-search yoy-search-button" @click="search"></i>
      </el-input></section>
    <el-table
      v-loading="loading"
      class="margin-top20"
      :data="tableData"
      border
      stripe
      style="width: 100%"
      row-key="RecordId"
    >
      <el-table-column
        prop="AliasName"
        label="机器人名称"
        width="180"
      >
      </el-table-column>
      <el-table-column
        prop="Description"
        label="描述"
        width="180">
      </el-table-column>
      <el-table-column
        prop="StatusString"
        label="状态"
        :render-header="renderProductId"
      >
        <template slot-scope="scope">
          <span :style="{'color': scope.row.StatusString === '已创建'? '#555':'#999'}">
            {{ scope.row.StatusString }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="CreateDate"
        label="创建时间">
        <template slot-scope="scope">
          <span v-if="scope.row.Status == 2">
            {{scope.row.CreateDate}}
          </span>
          <span v-else>
            -
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
      >
        <template slot-scope="scope">
          <span class="yoy-list-todo c555">
            <span v-if="scope.row.config == 2">
              <span class="config">
                <i class="el-icon-setting"></i>
                <a href="javascript:;" class="c555">配置</a>
              </span>
              <span class="del">
                <i class="el-icon-delete"></i>
                <a href="javascript:;" class="c555" @click="del(scope.$index,scope.row)">删除</a>
              </span>
            </span>
            <span class="yoy-botList-create" v-else-if="scope.row.config==1">
              <span class="primary-color">
                <i class="el-icon-refresh rotate360" ></i>
                <span class="creating">创建中...</span>
                <span class="wait">（ 预计需要三分钟 ）</span>
              </span>
            </span>
            <span v-else class="create" v-else-if="scope.row.config==0">
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
  import {REPLACE,UPDATE} from "../../store/mutations";
  import {request} from "../../serive/request";
  import store from '../../store/index'
  import {getCookies} from "../../utils/cookie";
  import {TOKEN} from "../../constants/constants";
  import {getList} from "../../serive/requestMethod";

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
          getList(URL.requestHost + BOT,{},ITEMKEY).then(
            ()=>{
              console.log('获取列表')
            }
          )
        }
      )

    },
    methods:{
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
        const that = this
        const token = getCookies(TOKEN)
        let obj = JSON.parse(JSON.stringify(row))
        let newObj = {...obj,StatusString:'ceshi',config:1}
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
            that.$message({
              type: 'success',
              message: '创建成功'
            });
          }
        ).catch(
          (err)=>{
            that.$message({
              type: 'error',
              message: '创建失败'
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
            that.$message({
              type: 'success',
              message: '删除成功'
            });
          }
        ).catch(
          (res)=>{
            that.$message({
              type: 'error',
              message: '删除失败，请稍后再试！'
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
        store.dispatch(REPLACE,{})
        const description = this.keyWords
        const searchStatus = store.state.app.searchStatus
        store.dispatch(REPLACE,{PageIndex:1}).then(
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
        debugger;
        this.data = {
          ...this.data,
          ...v
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import '../../style/index';
  .yoy-search-button{
    width: $iconW;
    background-color: $primary-color;
  }
  .yoy-search-button:hover{
    cursor:pointer;
  }
  .search{
    width: 360px;
    height: 32px;
  }
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
