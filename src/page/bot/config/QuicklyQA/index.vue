<template>
  <section>
    <section class="p-relative" style="">
      <el-button type="primary" class="text-a-c createAnswer" @click="newQA">创建新问答</el-button><el-input v-model='keys' class='searchInput' style="left: 120px;" size = 'small' placeholder="输入关键词搜索" @keyup.enter.native="search"><i slot="suffix" class="el-input__icon el-icon-search yoy-search-button" @click="search"></i>
      </el-input>
        <el-button type="primary" v-if="!enableChecked" :disabled='originDisabled' class="p-absolute right-0" @click="typeCheckedStatus" style="-webkit-transition: 0s;-moz-transition: 0s;-ms-transition: 0 time;-o-transition: 0s;transition: 0s;">选择</el-button>
      <span v-else class="p-absolute right-0">
        <el-button class='cancel' style="width: 100px;padding-right: 0;padding-left: 0;margin-right: 10px;" @click="typeCheckedStatus">取消选择</el-button><el-button :disabled="buttonStatus" type="primary" style="margin-right: 10px;" @click="train">测试</el-button><el-button type="primary" :disabled="buttonStatus" @click="publish" >发布</el-button>
      </span>
    </section>
    <el-table
      v-loading="loading"
      :data="tableData"
      stripe
      border
      style="width: 100%;margin-top: 20px;">
      <el-table-column
        label="序号"
        width="90"
        align="center"
      >
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.checkedStatus" v-if="enableChecked" @change="checked(scope.row.checkedStatus,scope.row.ID,scope.$index,scope.row.Status)"></el-checkbox>
          <span v-else>{{scope.$index+1}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="Question"
        label="问题"
        >
        <template slot-scope="scope">
          <section class='link' style="height: 28px;line-height: 28px;" @click="pathToDetail(scope.row)">
            {{scope.row.Question}}
          </section>
        </template>
      </el-table-column>
      <el-table-column
        prop="Status"
        width="160"
      >
        <template slot="header" slot-scope="scope">
          <el-dropdown @command="handleCommand" trigger='click' placement="bottom-start" class="p-absolute left-0 yoy-dropDown">
  <span class="el-dropdown-link c333">
    {{title}}<i class="el-icon-arrow-down el-icon--right"></i>
  </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="key" v-for="(value, key, index) in options">{{value}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
        <template slot-scope="scope"><span>{{statusString[scope.row.Status]}}</span></template>
      </el-table-column>
      <el-table-column
        prop="CreateDate"
        label="创建时间"
        :width="showDel?'320':'160'"
      >
      </el-table-column>
      <el-table-column
        width="160"
        v-if="!showDel"
      >
        <template slot='header' slot-scope="scope">
          <section class="handle" style="height: 28px;line-height: 28px">
            操作
          </section>
        </template>
        <template slot-scope="scope">
          <section class="handle" style="height: 28px;line-height: 28px">
            <span :class="[scope.row.Status == '5'?'un-handle':'edit']" style="margin-right: 20px" @click="editSomething(scope.row)">
              <i class="el-icon-edit" style="margin-right: 5px;"></i>
              <span>编辑</span>
            </span>
            <span :class="[scope.row.Status == '5'?'un-handle':'delete']" @click="handDel(scope.row.ID,scope.$index,scope.row.Status)"><i class="el-icon-close" style="margin-right: 5px;"></i><span>删除</span></span>
          </section>
        </template>
      </el-table-column>
    </el-table>
    <section class="p-relative">
      <el-pagination
        @current-change="handleCurrentChange"
        class="pagination p-absolute"
        background
        page-size="50"
        layout="total, prev, pager, next"
        :total="total"
        :current-page.sync="PageIndex"
      >
      </el-pagination>
    </section>
  </section>
</template>
<script>
  import questionOptions from './constants'
  import {getList,del,_ask,doSomething} from './service'
  import URL from '../../../../host/baseUrl'
  import {PUBLISHORTRAIN} from "../../../../constants/api";
  import store from '../../../../store';
  import {REPLACE} from "../../../../store/mutations";

  import {mapActions} from 'vuex';

  export default {
    data() {
      return {
        loading: false,
        workStatus: false,
        tableDataCopy:[],
        tableData: [],
        enableChecked: false,
        options: questionOptions.status,
        title:'状态',
        status:'',
        statusString:{0:'不可用',1:'未发布',2:'未发布',3:'未发布',4:'未发布',5:'已发布'},
        keys:'',
        total:0,
        PageIndex:1,
        arr:[],
        showDel:false,
        buttonStatus:true,
        reloadId:null,
        hasPublishArr:[],
        originArr:[],
        originDisabled:true,
      }
    },
    /*
    生命周期函数
     */
    created(){
      this.tableData = []
      this.total = 0
      /*
      获取初始列表
       */
      const that = this
      this.loading = true
      _ask().then(
        (res) => {
          getList().then(
            (res) => {
              /*
              自定义列表内容,没有在发布中的内容
               */
              that.complateGetList(res)
            }
          ).catch(
            (err) =>{
              /*
              抛出错误
               */
            }
          )
        }
      ).catch(
        () =>{
          store.dispatch(REPLACE,{mainLoading:true,loadingText:'正在培训或发布中，请稍后'}).then(
            () =>{
              that.loading = false
              that._reload_ask()
            }
          )
        }
      )

    },
    destroyed(){
      store.dispatch(REPLACE,{mainLoading:false,loadingText:null})
      clearInterval(this.reloadId);
    },
    methods: {
      ...mapActions(
        ["newDataDis",]
      ),
      newQA() {
        const query = this.$route.query;
        this.newDataDis(); // 进入创建问题 首页
        this.$router.push({
          path:'/bot/config/quicklyQA/createrNewQA',
          query:{
            recordId:query.recordId,
            // ...query,
          }
        })
      },
      editSomething(v){
        const query = this.$route.query;
        sessionStorage.setItem('edit',JSON.stringify(v) ); // 存入
        if(v.Status == 5){
          return;
        }else{
          this.$router.push({
            path:'/bot/config/quicklyQA/editQA',
            query:{
              // ...query,
              recordId:query.recordId,
              title:v.Question,
              v
            }
          })
        }
      },
      pathToDetail(v){
        const query = this.$route.query;
        sessionStorage.setItem('detaildata',JSON.stringify(v) ); // 存入

        this.$router.push({
          path:'/bot/config/quicklyQA/detailQA',
          query:{
            recordId:query.recordId,
            title:v.Question,
            v
          }
        })
      },
      go(){
        const id = this.$route.query.recordId?this.$route.query.recordId:JSON.parse(sessionStorage.getItem('recordId'))
        const host = 'https://'+window.location.host
        const url = `${host}/WebTalk/validaiml.html?id=${id}`
        window.open(url)
      },
      _reload_ask(v = true){
        const that = this
        this.reloadId = setInterval(function () {
          _ask().then(
            () =>{
              /*
              不存在发布
              */
              store.dispatch(REPLACE,{mainLoading:false,loadingText:null})
              that.loading = true
              const params = {
                Keys:that.keys,
                PageIndex:that.PageIndex,
                Status: that.status
              }
              that.showDel = false
              that.enableChecked = false
              getList(params).then(
                (res) =>{
                  that.tableData = res['Data']
                  that.total = res.TotalCount
                  that.originDisabled = that.tableData.length <= 0
                  that.loading = false
                  clearInterval(that.reloadId);
                  if(v){
                    that.go()
                  }
                }
              )
              /*
               获取列表
              */

            }
          ).catch(
            () =>{
              // that.workingStatus = true
            }
          )
        },5000)
      },
      complateGetList(res){
        this.tableData = res['Data']
        this.originDisabled = this.tableData.length <= 0
        this.total = res.TotalCount
        this.PageIndex = res.PageIndex
        this.loading = false
      },
      handleCommand(command){
        this.originDisabled = true
        this.tableData = []
        this.total = 0
        this.title = this.options[command]
        this.status= command?command-0:null
        const status = {Status:this.status}
        this.keys = ''
        this.loading = true
        getList(status).then(
          (res) => {
            this.complateGetList(res)
          }
        )
      },
      typeCheckedStatus(v){
        const that = this
        this.enableChecked = !this.enableChecked
        /*
        优化页面闪烁视觉不适
         */
        this.loading=true
        setTimeout(
          () => {
            that.showDel = !that.showDel
          },300
        )
        setTimeout(
          () =>{
            that.loading=false
          },800
        )
        /*
        当操作状态为取消选择时
        */
        if(!that.enableChecked){
          /*
            初始化列表复选框状态
          */
          that.tableData.forEach(
            (v) =>{
              v.checkedStatus = false
            }
          )
          /*
          初始化数组状态
          */
          that.arr = []
          that.hasPublishArr = []
          const params = {
            Keys:that.keys,
            PageIndex:that.PageIndex,
            Status: that.status
          }
          getList(params).then(
            (res) => {
              /*
              给table重新赋值
              */
              that.tableData = res['Data']
              that.loading=false
            }
          )

        }else{
          /*
          当操作状态时选择时，初始化arr
          */
          that.arr = []
          that.hasPublishArr = []
          that.tableData.forEach(
            (v,index) =>{
              switch (v.Status) {
                case 3:
                  that.arr.push(v.ID)
                      break;
                case 5:
                  that.arr.push(v.ID)
                  that.hasPublishArr.push(v.ID)
                      break;
                default:
                  break;
              }
            }
          )
          that.buttonStatus=that.arr.length <= 0
          that.originArr = that.arr.slice(0)
        }
      },
      search() {
        this.tableData = []
        this.loading = true
        this.originDisabled = true
        const Keys = {Keys:this.keys}
        getList(Keys).then(
          (res) => {
            this.complateGetList(res)
            this.title = '状态'
          }
        ).catch(
          () => {
            this.loading = false
          }
        )
      },
      handDel(v,index,status) {
        if(status == 5){
          return;
        }
        this.$confirm('是否删除此条问题?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch(REPLACE,{mainLoading:true})
          const params = {
            QuickQuizId:v
          }
          del(params).then(
            (res) => {
              this.tableData.splice(index,1)
              this.total--;
              store.dispatch(REPLACE,{mainLoading:false})
              this.$message({
                type: 'success',
                message: '删除成功'
              });
            }
          ).catch(
            () =>{
              store.dispatch(REPLACE,{mainLoading:false})
              this.$message({
                type: 'error',
                message: '删除失败，请稍后重试'
              });
            }
          )
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      checked(v,id,index,status){
        /*
          选中时，arr添加ID，
         */
        if(v){
          if(status == 5){
            this.hasPublishArr.push(id)
          }
          this.arr.push(id)
        }else{
          /*
          取消时，删除此id
         */
          const index = this.arr.indexOf(id);
          this.arr.splice(index,1)

        }
        /*
          根据arr长度更改测试按钮状态
         */
        this.arr.length>0?this.buttonStatus = false:this.buttonStatus = true
        console.log(this.arr)
      },
      train(){
        const that = this
        this.$confirm('确定测试以上问题?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch(REPLACE,{mainLoading:true,loadingText:'正在培训中，请稍后'})
          if(that.hasPublishArr.length>0){
            that.hasPublishArr.forEach(
              (v,k) =>{
                const index = that.arr.indexOf(v);
                if(index>-1){
                  that.arr.splice(index,1)
                }
              }
            )
          }
          let equal = true;
          that.arr.forEach(
            (v,index) =>{
              const value = that.originArr.indexOf(v);
              if(value <= -1){
                equal = false
              }
            }
          )
          if(that.arr.length === 0 ||equal){
            store.dispatch(REPLACE,{mainLoading:false,loadingText:null}).then(
              () =>{
                const params = {
                  Keys:that.keys,
                  PageIndex:that.PageIndex,
                  Status: that.status
                }
                getList(params).then(
                  (res) => {
                    /*
                    给table重新赋值
                    */
                    that.showDel = false
                    that.enableChecked = false
                    that.tableData = res['Data']
                    that.go()
                  }
                )
              }
            )
          }else{
            const params = {
              Ids: that.arr,
              Action:'train',
            }
            doSomething(URL.requestHost+PUBLISHORTRAIN,params).then(
              (res) =>{
                that._reload_ask()
              }
            ).catch(
              () =>{
                that.$message({
                  type:'error',
                  message:'操作失败',
                  duration:2000,
                })
              }
            )
          }

        }).catch(() => {
          that.$message({
            type: 'info',
            message: '已取消测试'
          });
        });
      },
      publish(){
        const that = this
        let equal = true;
        that.arr.forEach(
          (v,index) =>{
            const value = that.hasPublishArr.indexOf(v);
            if(value <= -1){
              equal = false
            }
          }
        )
        if(equal){
          that.$confirm('以上问题均已发布，是否重新发布','提示',{
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(
            () =>{
              store.dispatch(REPLACE,{mainLoading:true,loadingText:'正在发布中，请稍后'})
              const params = {
                    Ids: that.arr,
                    Action:'publish',
                  }
              doSomething(URL.requestHost+PUBLISHORTRAIN,params).then(
                (res) =>{
                  that._reload_ask(false)
                }
              ).catch(
                () =>{
                  that.$message({
                    type: 'error',
                    message: '服务器错误',
                    duration:2000,
                  });
                }
              )
            }
          ).catch(
            () =>{
              that.$message({
                type: 'info',
                message: '已取消发布',
                duration:2000,
              });
            }
          )
        }else{
          that.$confirm('确定发布以上问题？','提示',{
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(
            () =>{
              store.dispatch(REPLACE,{mainLoading:true,loadingText:'正在发布中，请稍后'})
              const params = {
                Ids: that.arr,
                Action:'publish',
              }
              doSomething(URL.requestHost+PUBLISHORTRAIN,params).then(
                (res) =>{
                  that._reload_ask(false)
                }
              ).catch(
                () =>{
                  that.$message({
                    type: 'error',
                    message: '服务器错误',
                    duration:2000,
                  });
                }
              )
            }
          ).catch(() =>{
            that.$message({
              type: 'info',
              message: '已取消发布',
              duration:2000,
            });
          })
        }
      }
    },

  }
</script>
<style scoped lang="scss">
  @import '../../../../style/index';
  .createAnswer{
    position: absolute;
    width: 100px;padding-left:0;padding-right:0;margin-right: 20px;
  }
  .margin-top20{
    margin-top: 20px;
  }
  .handle{
    .edit:hover{
      color:$primary-color;
      cursor: pointer;
      span:hover{
        text-decoration: underline;
      }
    }
    .delete:hover{
      cursor: pointer;
      color:$danger;
      span:hover{
        text-decoration: underline;
      }
    }
    .un-handle{
      span{
        cursor: default;
        color:$disabled;
      }
    }
  }
  .yoy-main .el-table .cell .yoy-dropDown{
    height: 28px;
    line-height: 28px;
    color:#333;
  }
  .yoy-dropDown:hover{
    cursor: pointer;
  }
  .un-handle{
    color:$disabled;
    cursor: default;
  }
  .link{
    cursor: pointer;
  }
  .link:hover{
    text-decoration: underline;
  }
</style>
