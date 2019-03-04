<template>
  <section >
    <div class="inputBox">
      <el-select v-model="value4" clearable placeholder="请选择技能集" class="select" @change="select">
      <el-option
        v-for="item in options"
        :key="item.ID"
        :label="item.SkillName"
        :value="item.SkillNo">
      </el-option>
    </el-select>

    <el-input class='searchInput'    size = 'small' v-model="keyWords" placeholder="关键词搜索" @keyup.enter.native="search"><i slot="suffix" class="el-input__icon el-icon-search yoy-search-button" @click="search"></i>
      </el-input>

    </div>

    <el-table
      v-loading="loading"
      :data="tableData"
      row-key="id"
      border
      stripe
      class="table"
      style="width: 100%">
      <el-table-column
        align="center"
        prop="index"
        label="序号"
        width='90'
        :resizable="resizable"
      >
      </el-table-column>
      <el-table-column
        prop="FriendlyName"
        :resizable="resizable"
        label="知识"
        min-width="200">
      </el-table-column>
      <el-table-column
        prop="status"
        :resizable="resizable"
        label="回答">
        <template slot-scope="scope">
            <span v-for="(data,key,index) in scope.row.status" :index='index' class="handleIcon dis-i-b p-relative" @click="handleDetail(scope.row.name,key, scope.row.index,scope.row.FriendlyName,scope.row.ID,scope.row.IntentName)">
              <span class="p-absolute"
                    :style="{
                    background: 'url(' + require(`../../../../assets/bot/${key}Checked.png`) + ')center center no-repeat'
                    }"></span>
              <span class='p-absolute'
                    :style="{
                    background: 'url(' + require(`../../../../assets/bot/${key}Checked.png`) + ')center center no-repeat',
                    display:data?'inline-block':'none'}"></span>
          </span>
        </template>
      </el-table-column>
    </el-table>
      <el-pagination
        @current-change="handleCurrentChange"
        class="pagination"
        background
        layout="total, prev, pager, next"
        :total="total"
        :current-page.sync="PageIndex"
      >
      </el-pagination>
    </section>
</template>

<script>
  import store from '../../../../store/index'
  import {REPLACE} from "../../../../store/mutations";
  import {BOTKNOWQUIZSKILL,BOTKNOWQUIZLIST} from "../../../../constants/api";
  import {getList} from "./service";
  import URL from '../../../../host/baseUrl'


  export default {
    data() {
      return {
        options: [],
        value4: '',
        loading:false,
        keyWords:'',
        resizable:false
      }
    },
    computed:{
      PageIndex(){
        return store.state.app.PageIndex
      },
      PageSize(){
        return store.state.app.PageSize
      },
      Key(){
        return store.state.app.Key
      },
      tableData(){
        return store.state.app.tableData
      },
      total(){
        return store.state.app.total
      },
      SkillNo(){
        return store.state.app.SkillNo
      }
    },
    created(){
      store.dispatch(REPLACE,{tableData:[],total:0}).then(
        () =>{
          /*获取答案列表*/
          this.get_Answer_List()
          /*获取技能列表*/
          this.get_Skill_List()
        }
      )
    },
    destroyed(){
      store.dispatch(
        REPLACE,{
          PageIndex:1,
          PageSize:10,
          Key:'',
          SkillNo:'',
        }
      )
    },
    methods:{
      get_Answer_List(){
        /*获取知识列表*/
        /*初始化请求参数*/
        const that = this
        this.loading = true
        const id = JSON.parse(sessionStorage.getItem('recordId'))
        const recordId = id?id:this.$route.query.recordId
        const data = {
          Data:{
            PageIndex:this.PageIndex,
            PageSize:this.PageSize,
            Key:this.Key,
            SkillNo:this.SkillNo,
          },
          BotConfigRecordId: recordId,
        }
        /*序列化请求参数*/
        const body = JSON.stringify(data)
        const options = {
          body,
        }
        getList(URL.requestHost + BOTKNOWQUIZLIST,options).then(
          (res)=>{
            res['Data'].forEach(
              (v,k) =>{
                v.index = k+1
                v.status = {
                  Wechat:v.Wechat ,
                  WebChat:v.WebChat ,
                  DeskTopChat:v.DeskTopChat ,
                  Robot:v.Robot ,
              }
                delete v.DeskTopChat
                delete v.Robot
                delete v.WebChat
                delete v.Wechat
              }
            )
            const TotalCount = res['TotalCount']
            const PageIndex = res['PageIndex']
            const PageSize = res['PageSize']
            store.dispatch(REPLACE,{tableData: res.Data,total:TotalCount,PageIndex,PageSize}).then(
              () =>{

              }
            )
          }
        ).catch(
          (err) =>{
            this.$message({
              type:'error',
              message:'服务器错误，请稍后重试',
              duration: 2000,
              onClose () {
                that.loading = false
              }
            })
          }
        )
      },
      get_Skill_List(){
        const recordId = this.$route.query.recordId
        const that = this
        /*获取技能列表*/
        /*初始化请求数据*/
        const skillData = {
          BotConfigId: recordId,
        }
        /*序列化请求数据*/
        const bodyData = JSON.stringify(skillData)
        const params = {
          body:bodyData
        }
        getList(URL.requestHost + BOTKNOWQUIZSKILL,params).then(
          (res) => {
            /*请求成功时*/
            that.options = res['TenantBotSkillSets']
          }
        ).catch(
          (err) =>{
            that.$message({
              type:'error',
              message:'服务器错误，请稍后重试！'
            })
            /*捕获到错误时*/
          }
        )
      },
      search(v){
        const str ="<>%;/?'_"
        const index = this.keyWords&&str.indexOf(this.keyWords) > -1
        if(index){
          this.$message({
            type:'error',
            message:"请不要输入特殊字符作为关键词搜索，例如 <，>，%，;，/，?，'，_等",
            duration:2000,
          })
          return
        }
        store.dispatch(REPLACE,{Key:this.keyWords,PageIndex:1}).then(
          () =>{
            this.get_Answer_List()
          }
        )
      },
      handleDetail(name,v,index,title,ID,IntentName){
        store.dispatch(REPLACE,{navIndex:title}).then(
          () => {
            const query = this.$route.query
            const url={
              path:'/bot/config/knowledgeQuiz/knowledgeDetail',
              query:{
                ...query,
                botCheckIndex:v,
                botName:name,
                title:title,
                IntentID:ID,
                IntentName
              }
            }
            this.$router.push(url)
          }
        )
      },
      handleCurrentChange(v){
        store.dispatch(REPLACE,{PageIndex:v}).then(
          () => {
            this.get_Answer_List()
          }
        )
      },
      select(v){
        this.loading = true
        store.dispatch(REPLACE, {SkillNo:v,PageIndex:1}).then(
          () =>{
            this.get_Answer_List()
          }
        )
      }
    }
  }
</script>
<style scoped lang="scss">
  @import '../../../../style/index';
  .inputBox{
    width:100%; height: 30px;
  }
  .select{
   float: left;
  }
  .searchInput{
     margin-left:20px;
  }
  .table{
    margin-top: 20px;
  }
  .handleIconContainer{
    height: 30px;
  }
  .handleIcon{
    height: 30px;
    width: 30px;
    margin-right: 20px;
    cursor: pointer;
    span{
      display: inline-block;
      width: 30px;
      height: 30px;
      margin-right: 20px;
      cursor: pointer;
    }
  }
</style>
