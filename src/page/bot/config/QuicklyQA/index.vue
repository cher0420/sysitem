<template>
  <section>
    <section class="p-relative" style="">
      <el-button  v-if="!enableChecked" type="primary" class="text-a-c createAnswer" @click="newQA">创建新问答</el-button>
      <el-input v-model='keys' class='searchInput' :style="{transition:'left .3s',left: !enableChecked?'120px':'0'}" size = 'small' placeholder="输入关键词搜索" @keyup.enter.native="search"><i slot="suffix" class="el-input__icon el-icon-search yoy-search-button" @click="search"></i>
      </el-input>
      <span v-if="!originDisabled">
        <el-button type="primary" v-if="!enableChecked" class="p-absolute right-0" @click="typeCheckedStatus" style="-webkit-transition: 0s;-moz-transition: 0s;-ms-transition: 0 time;-o-transition: 0s;transition: 0s;">选择</el-button>
        <span v-else class="p-absolute right-0">
          <el-button class='cancel' style="width: 100px;padding-right: 0;padding-left: 0;margin-right: 10px;" @click="typeCheckedStatus">取消选择</el-button><el-button :disabled="tableDataCopy.length>0?false:true" type="primary" style="margin-right: 10px;" @click="train">测试</el-button><el-button type="primary" :disabled="tableDataCopy.length>0?false:true" @click="publish">发布</el-button>
        </span>
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
        <template slot="header" slot-scope="scope">
          <span v-if="enableChecked">

          </span>
          <span v-else>
            序号
          </span>
        </template>
        <template slot-scope="scope">
          <el-checkbox style="height: 24px;line-height: 24px;margin-bottom: 0" v-model="scope.row.checkedStatus" v-if="enableChecked" @change="checked(scope.row.checkedStatus,scope.row.ID,scope.$index,scope.row.Status)"></el-checkbox>
          <span v-else>{{scope.$index+1}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="Question"
        label="问题"
        >
        <template slot-scope="scope">
          <section class='link' @click="pathToDetail(scope.row)">
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
          <section class="handle" style="height: 24px;line-height: 24px">
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
        :page-size="PageSize"
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
        tableData: [],
        dataContainer:[],
        tableDataCopy:[],
        enableChecked: false,
        options: questionOptions.status,
        title:'状态',
        status:'',
        statusString:{0:'不可用',1:'未发布',2:'未发布',3:'未发布',4:'未发布',5:'已发布'},
        keys:'',
        total:0,
        PageIndex:1,
        PageSize:50,
        arr:[],
        showDel:false,
        reloadId:null,
        originDisabled:true,
        blankNew:false,
        id:null,
      }
    },
    /*
    生命周期函数
     */
    created(){
      this.tableData = []
      this.total = 0
      const status = sessionStorage.getItem('doingStatus')
      if(status === 'nothing'){
        store.dispatch(REPLACE,{id:this.$route.query.recordId})
      }
      console.log('created时会清楚的',status,store.state.app.quickQuizRecordId)
      // clearInterval(store.state.app.quickQuizRecordId)
      // const reloadArr = store.state.app.quickQuizRecordIdArr
      // if(reloadArr.length>0){
      //   reloadArr.forEach(
      //     (v,index) =>{
      //       clearInterval(v);
      //     }
      //   )
      // }

      /*
      获取全部已发布的数据
      */
      const params = {PageSize:0, Status:1}
      getList(params).then(
        (res) =>{
          if(res['Data'].length>0){
            res['Data'].forEach(
              (v,index) =>{
                      that.dataContainer.push(v.ID)
                    }
            )
            that.tableDataCopy = that.dataContainer.slice(0)}
        }
      )
      /*
       获取初始列表
       */
      const that = this
      this.loading = true
      _ask().then(
        (res) => {
          sessionStorage.setItem('doingStatus','nothing')
          // store.dispatch(REPLACE,{id:that.$route.query.recordId})
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
              that.loading = false
                }
              )
            }
      ).catch(
        (err) =>{
          store.dispatch(REPLACE,{mainLoading:true,loadingText:null}).then(
            () =>{
                that.loading = false
                console.log('created===>quickQuizRecordId',store.state.app.quickQuizRecordId)
                // if(store.state.app.quickQuizRecordId){
                //   if(store.state.app.quickQuizRecordId >-1){
                    clearInterval(store.state.app.quickQuizRecordId)
                    that._reload_ask(true)
                //   }else{
                //     that._reload_ask(true)
                //   }
                // }else{
                //   that._reload_ask(true)
                // }
            }
          )
        }
      )
    },
    destroyed(){
      store.dispatch(REPLACE,{mainLoading:false,loadingText:null})
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
        const id = store.state.app.id
        const BotConfigId = id?id:this.$route.query.recordId
        const host = URL.baseUrl
          const url = `${host}/WebTalk/validaiml.html?id=${BotConfigId}`
          window.open(url)
      },
      handleCurrentChange(v) {
        this.PageIndex = v
            const options = {

                PageIndex: this.PageIndex,
                Status: this.status,
                Keys:this.keys

            }
            getList(options).then(
              (res) =>{
                res['Data'].forEach(
                  (v,index) =>{
                    if(this.tableDataCopy.includes(v.ID)){
                      v.checkedStatus = true
                    }else{
                      v.checkedStatus = false
                    }
                  }
                )
                this.complateGetList(res)
              }
            )
      },
      _reload_ask(isGetList){
        const that = this
        // if(!JSON.parse(sessionStorage.getItem('doingStatus'))&&!store.state.app.quickQuizRecordId){
          let id = setInterval(function () {
            console.log('----轮询返回的id',id)
            const arr = store.state.app.quickQuizRecordIdArr
            arr.push(id)
            store.dispatch(REPLACE,{quickQuizRecordIdArr:arr}).then(
              () =>{
                _ask().then(
                  () =>{
                    /*
                    不存在发布
                    */
                    that.arr = []

                    sessionStorage.setItem('doingStatus','nothing')//设置没有进行测试或发布的线程了

                    clearInterval(store.state.app.quickQuizRecordId);
                    console.log('---轮询结束后需要清除的id',store.state.app.quickQuizRecordId)

                    //
                    // const reloadArr = store.state.app.quickQuizRecordIdArr
                    // if(reloadArr.length>0){
                    //   reloadArr.forEach(
                    //     (v,index) =>{
                    //       clearInterval(v);
                    //     }
                    //   )
                    // }
                    store.dispatch(REPLACE,{mainLoading:false,loadingText:null,quickQuizRecordIdArr:[]}).then(
                      () =>{
                        console.log('====',isGetList)
                        if(isGetList){
                          console.log('不存在发布，刷新列表')
                          getList().then(
                            (res) =>{
                              that.complateGetList(res)
                            }
                          )
                        }
                        if(that.blankNew){
                          that.tableData.forEach(
                            (v,index) =>{
                              if(v.checkedStatus){
                                that.arr.push(v.ID)
                              }
                            }
                          )
                          that.go()
                        }else{
                          that.dataContainer = []
                          const params = {
                            PageSize: 0,
                            Status:1,
                          }
                          getList(params).then(
                            (res) =>{
                              if(res['Data'].length>0){
                                res['Data'].forEach(
                                  (v,index) =>{
                                    that.dataContainer.push(v.ID)
                                  }
                                )
                              }
                            }
                          )
                          that.tableData.forEach(
                            (v,index) =>{
                              if(v.checkedStatus){
                                v.Status = 5
                                that.arr.push(v.ID)
                              }else{
                                v.Status = 1
                              }
                            }
                          )
                          // that.$message({
                          //   type:'success',
                          //   message:'操作成功',
                          //   duration:2000,
                          // })
                        }
                      }
                    )
                  }
                ).catch(
                  (res) =>{
                    if(res.Data === 3){
                      that.$message(
                        {
                          type:'error',
                          message:'操作失败，请稍后重试',
                          duration:2000,
                        }
                      )
                      sessionStorage.setItem('doingStatus','nothing')
                      clearInterval(that.reloadId)
                      const params = {
                        Keys:that.keys,
                        PageIndex:that.PageIndex,
                        Status: that.status
                      }
                      getList(params).then(
                        (res) =>{
                          that.complateGetList(res)
                          store.dispatch(
                            REPLACE,{mainLoading:false,loadingText:null}
                          )
                        }
                      ).catch(
                        (err) =>{
                          that.message(
                            {
                              type:'error',
                              message:'服务器错误，请稍后重试',
                              duration:2000,
                              onClose: () =>{
                                store.dispatch(
                                  REPLACE,{mainLoading:false}
                                )
                              }
                            }
                          )
                        }
                      )
                    }else if(res.Data === 1){
                      that.blankNew = true
                      store.commit(REPLACE,{loadingText:'正在培训中，请稍后'})
                    }else{
                      that.blankNew = false
                      store.commit(REPLACE,{loadingText:'正在发布中，请稍后'})
                    }
                  }
                )
              }
            )
          },5000)
          store.dispatch(REPLACE,{quickQuizRecordId: id})
        // }

      },
      complateGetList(res){
        this.tableData= res['Data']
        this.originDisabled = this.tableData.length <= 0
        this.total = res.TotalCount
        this.PageIndex = res.PageIndex
        this.loading = false
      },
      handleCommand(command){
        const that = this
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
            res['Data'].forEach(
              (v,index) =>{
                if(that.tableDataCopy.includes(v.ID)){
                  v.checkedStatus = true
                }else{
                  v.checkedStatus = false
                }
              }
            )
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
          that.tableDataCopy = that.dataContainer.slice(0)
          that.tableData.forEach(
            (v,index) =>{
              switch (v.Status) {
                case 5:
                  that.arr.push(v.ID)
                  v.checkedStatus = true
                  break;
                default:
                  break;
              }
            }
          )
        }
      },
      search() {
        const that = this
        this.tableData = []
        this.loading = true
        this.originDisabled = true
        const Keys = {Keys:this.keys}
        getList(Keys).then(
          (res) => {
            res['Data'].forEach(
              (v,index) =>{
                if(that.tableDataCopy.includes(v.ID)){
                  v.checkedStatus = true
                }else{
                  v.checkedStatus = false
                }
              }
            )
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
        const that = this
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
              if(this.total%this.PageSize === 0){
                this.PageIndex--;
                const params = {
                  PageIndex: this.PageIndex,
                  Status: this.status,
                  Keys:this.keys
                }
                getList(params).then((res) =>{
                  that.complateGetList(res)
                })
              }
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
          this.tableDataCopy.push(id)
          this.arr.push(id)
        }else{
          /*
          取消时，删除此id
         */

          const arrIndex = this.arr.indexOf(id);
          this.arr.splice(arrIndex,1)

          const index = this.tableDataCopy.indexOf(id);
          this.tableDataCopy.splice(index,1)
        }
      },
      train(){
        const that = this
        this.$confirm('确定测试以上问题?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch(REPLACE,{mainLoading:true,loadingText:'正在培训中，请稍后'})
            const params = {
              Ids: that.tableDataCopy,
              Action:'train',
            }

            // that.blankNewObj = true
            that.blankNew = true
            sessionStorage.setItem('doingStatus','train')
            store.dispatch(REPLACE,{id:that.$route.query.recordId}).then(
              () =>{
                that._reload_ask(false) //开启论询且不刷新列表
              }
            )
            doSomething(URL.requestHost+PUBLISHORTRAIN,params).then(
              (res) =>{
              }
            ).catch(
              () =>{
                that.$message({
                  type:'error',
                  message:'操作失败',
                  duration:2000,
                  onClose: () =>{
                    store.dispatch(REPLACE,{mainLoading: false,loadingText:null})
                  }
                })
              }
            )
        }).catch(() => {
          that.$message({
            type: 'info',
            message: '已取消测试'
          });
        });
      },
      publish(){
        const that = this
          that.$confirm('本次发布内容将覆盖上一次发布，是否继续发布？','提示',{
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(
            () =>{
              store.dispatch(REPLACE,{mainLoading:true,loadingText:'正在发布中，请稍后'})
              const params = {
                Ids: that.tableDataCopy,
                Action:'publish',
              }

              that.blankNew = false
              sessionStorage.setItem('doingStatus','publish')
              store.dispatch(REPLACE,{id:that.$route.query.recordId}).then(
                () =>{
                  that._reload_ask()
                }
              )

              doSomething(URL.requestHost+PUBLISHORTRAIN,params).then(
                (res) =>{

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
  }
</script>
<style scoped lang="scss">
  @import '../../../../style/index';
  .createAnswer{
    position: absolute;
    width: 100px;
    padding-left:0;
    padding-right:0;
    margin-right: 20px;
    transition: width 1s;
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
    display: inline-block;
    cursor: pointer;
  }
  .link:hover{
    text-decoration: underline;
  }
</style>
