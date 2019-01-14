<template>
  <section>
    <a :href="blankUrl" style="display: none" target="_blank" id="blankNew" ref="blankNew"></a>
    <section class="p-relative" style="">
      <el-button  v-if="!enableChecked" type="primary" class="text-a-c createAnswer" @click="newQA">创建新问答</el-button>
      <el-input v-model='keys' class='searchInput' :style="{transition:'left .3s',left: !enableChecked?'120px':'0'}" size = 'small' placeholder="输入关键词搜索" @keyup.enter.native="search"><i slot="suffix" class="el-input__icon el-icon-search yoy-search-button" @click="search"></i>
      </el-input>
      <span v-if="!originDisabled">
        <el-button type="primary" v-if="!enableChecked" class="p-absolute right-0" @click="typeCheckedStatus" style="-webkit-transition: 0s;-moz-transition: 0s;-ms-transition: 0 time;-o-transition: 0s;transition: 0s;">编辑</el-button>
        <span v-else class="p-absolute right-0">
          <el-button class='cancel' style="width: 100px;padding-right: 0;padding-left: 0;margin-right: 10px;" @click="typeCheckedStatus">取消编辑</el-button><el-button :disabled="tableDataCopy.length>0?false:true" type="primary" style="margin-right: 10px;" @click="train">培训</el-button><el-button type="primary" :disabled="tableDataCopy.length>0?false:true" @click="publish">发布</el-button>
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
        :resizable="resizable"
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
        :resizable="resizable"
        >
        <template slot-scope="scope">
          <section class='link' @click="pathToDetail(scope.row)">
            {{scope.row.Question}}
          </section>
        </template>
      </el-table-column>
      <el-table-column
        prop="Keyword"
        label="关键词"
        :resizable="resizable"
      >
        <template slot-scope="scope">
          {{scope.row.Keyword.replace(/,/g,'、')}}
        </template>
      </el-table-column>
      <el-table-column
        prop="Status"
        width="160"
        :resizable="resizable"
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
        :resizable="resizable"
        :width="showDel?'320':'160'"
      >
      </el-table-column>
      <el-table-column
        width="160"
        :resizable="resizable"
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
    <el-pagination
      @current-change="handleCurrentChange"
      class="pagination"
      background
      :page-size="PageSize"
      layout="total, prev, pager, next"
      :total="total"
      :current-page.sync="PageIndex"
    >
    </el-pagination>
  </section>
</template>
<script>
  import questionOptions from './constants'
  import {getList,del,_ask,doSomething} from './service'
  import URL from '../../../../host/baseUrl'
  import {PUBLISHORTRAIN} from "../../../../constants/api";
  import store from '../../../../store';
  import {REPLACE} from "../../../../store/mutations";
  import $ from 'jquery';

  import {mapActions} from 'vuex';

  export default {
    data() {
      return {
        resizable:false,
        border:true,
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
        PageSize:10,
        // arr:[],
        showDel:false,
        // reloadId:null,
        originDisabled:true,
        // id:null,
        blankUrl:'',
      }
    },
    /*
    生命周期函数
     */
    created(){
      this.tableData = []
      this.total = 0

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
          getList().then(
            (res) => {
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
          store.dispatch(REPLACE,{loadingText:null})
          if(that.$route.path === '/bot/config/quicklyQA'){
            store.dispatch(REPLACE,{mainLoading:true})
            if(err.Data === 3){
              that.clearReloadId(err)
              const params = {Status:null}
              getList(params).then(
                (res) =>{
                  that.complateGetList(res)
                  store.dispatch(
                    REPLACE,{mainLoading:false,loadingText:null}
                  )
                }
              ).catch(
                err => err
              )
              return ;
            }else if(err.Data === 1){
              store.dispatch(REPLACE,{loadingText:'培训预计需要几分钟，请稍后'})
              that.initStatus('train')
            }else if(err.Data === 2){
              store.dispatch(REPLACE,{loadingText:'正在发布中，请稍后'})
              that.initStatus('publish')
            }
            that.loading = false
            that.clearReloadId(err)
            that._reload_ask(true,err.recordId)
          }
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
      go(recordId){
        const BotConfigId = recordId?recordId:this.$route.query.recordId
        const host = URL.baseUrl
        const url = `${host}/WebTalk/validaiml.html?id=${BotConfigId}`
        // this.blankUrl = url

        // const link = this.$refs['blankNew']
        // link.click()
        // 监听change事件:
        //   const newScreen = window.open()
        //   newScreen.location = url
        //window.open(url, '_blank');
        // this.createSomeThing(url)
        //this.callbackfunction(url)
        this.downloadReportEvent(url,'someThing')
      },
      downloadReportEvent(downloadFileUrl,fileName) {

        var theAnchor = $("<a href='" + downloadFileUrl + "' target='_blank'>file</a >");
        //判断是否为chroczme浏览器
        // if (isChrome()) {
        //   theAnchor.attr('download', fileName);
        // }

        //var theAnchor = $('<a />')
        //theAnchor.attr('href', urls[i].url);
        //theAnchor[0].dispatchEvent(new MouseEvent('click'));//IE不支持此方式附加事件

        var e = document.createEvent('MouseEvents');
        e.initEvent('click', true, true);
        theAnchor[0].dispatchEvent(e);

        theAnchor.remove();
      },
      // createSomeThing(url){
      //
      //   var o = document.body;
      //   var a = document.createElement("a");
      //   a.setAttribute("id", "blankNew");
      //   a.setAttribute("target", "_blank");
      //
      //   a.href = url;
      //   a.innerHTML = '特殊';
      //   a.style.color = "red";
      //   o.appendChild(a);
      //   this.callbackfunction(url)
      //
      // },
      // callbackfunction(url){
      //
      //   var comment = document.getElementById('blankNew');
      //
      //   if (document.all) {
      //     // For IE
      //     comment.click();
      //   } else if (document.createEvent) {
      //     //FOR DOM2
      //     var ev = document.createEvent('MouseEvents');
      //     ev.initEvent('click', true, true);
      //
      //     comment.dispatchEvent(ev);
      //   }
      //
      // },
      handleCurrentChange(v) {
        this.loading = true
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
      _reload_ask(isGetList,botId){
        const that = this
        let id = setInterval(function () {
          _ask(botId).then(
            (res) =>{
              /*
              不存在发布
              */
              /*
              clearReloadId
              */

              that.clearReloadId(res)
              let loading = true;
              const arr = store.state.app.quickQuizArr

              arr.forEach(
                (v,index) =>{
                  if(v.recordId === that.$route.query.recordId){
                    loading = v.loading
                    return
                  }
                  loading = false
                }
              )

              if(that.$route.path === '/bot/config/quicklyQA'){
                store.dispatch(REPLACE,{mainLoading:loading})
              }
              store.dispatch(REPLACE,{loadingText:null})
              if(isGetList){
                that.loading = true
                getList().then(
                  (res) =>{
                    that.complateGetList(res)
                  }
                )
              }

              if(that.isReloadBlankNew(res.recordId)){
                that.go(res.recordId)
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
                    }else{
                      v.Status = 1
                    }
                  }
                )
              }
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
                // sessionStorage.setItem('doingStatus','nothing')
                that.clearReloadId(res)
                // clearInterval(that.reloadId)
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
                    that.$message(
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
                that.initStatus('train',res.recordId)
                if(that.$route.path === '/bot/config/quicklyQA'){
                  botId === that.$route.query.recordId?store.commit(REPLACE,{loadingText:'培训预计需要几分钟，请稍后'}):null
                }
              } else{
                that.initStatus('publish',res.recordId)
                if(that.$route.path === '/bot/config/quicklyQA') {
                  botId === that.$route.query.recordId ? store.commit(REPLACE, {loadingText: '正在发布中，请稍后'}) : null
                }
              }
            }
          )
        },20000)
        that.addReloadArr(id,botId)
      },
      clearReloadId(err){
        const reloadArr = store.state.app.quickQuizArr
        let newID = null;
        reloadArr.forEach(
          (v,index) =>{
            if(v.recordId === err.recordId){
              v.loading = false
              newID = v.id
              return
            }
          }
        )
        clearInterval(newID);
      },
      addReloadArr(id,botId){
        const arr = store.state.app.quickQuizArr
        arr.forEach(
          (v,index) =>{
            if(v.recordId === botId){
              v.id = id
              return
            }
          }
        )
        store.dispatch(REPLACE,{quickQuizArr:arr})
      },
      isReloadBlankNew(botId){
        const arr = store.state.app.quickQuizArr
        let status = false
        arr.forEach(
          (v,index) =>{
            if(botId ===v.recordId && v.doing === 'train'){
              status = true //此id为之前测试过的id
            }
          }
        )
        return status
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
          that.tableDataCopy = that.dataContainer.slice(0)
          that.tableData.forEach(
            (v,index) =>{
              switch (v.Status) {
                case 5:
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

        this.loading = true
        const str ="<>%;/?'_"
        const index = this.keys&&str.indexOf(this.keys) > -1
        if(index){
          this.$message({
            type:'error',
            message:"请不要输入特殊字符作为关键词搜索，例如 <，>，%，;，/，?，'，_等",
            duration:2000,
          })
          that.loading = false
          return
        }
        this.originDisabled = true
        this.tableData = []
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
                if(this.PageIndex !== 1){
                  this.PageIndex --
                }
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
        }else{
          /*
          取消时，删除此id
         */
          const index = this.tableDataCopy.indexOf(id);
          this.tableDataCopy.splice(index,1)
        }
      },
      train(){
        const that = this
        this.$confirm('确定培训以上问题?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch(REPLACE,{mainLoading:true,loadingText:'培训预计需要几分钟，请稍后'})
          const params = {
            Ids: that.tableDataCopy,
            Action:'train',
          }
          that.initStatus('train',that.$route.query.recordId)
          store.dispatch(REPLACE,{id:that.$route.query.recordId}).then(
            () =>{
              that._reload_ask(false,that.$route.query.recordId) //开启论询且不刷新列表
            }
          )
          doSomething(URL.requestHost+PUBLISHORTRAIN,params).then(
            (res) =>{
            }
          ).catch(
            (err) =>{
              that.$message({
                type:'error',
                message:'服务器错误',
                duration:2000,
              })
              that.clearReloadId(err)
              store.dispatch(REPLACE,{mainLoading: false,loadingText:null})
            }
          )
        }).catch(() => {
          that.$message({
            type: 'info',
            message: '已取消培训'
          });
        });
      },
      initStatus(key,id){
        const recordId = id?id:this.$route.query.recordId
        let arr = store.state.app.quickQuizArr
        const item = {recordId,id:null,doing:key}
        let status = true;
        arr.forEach(
          (v,index) =>{
            if(v.recordId === recordId){
              v.doing = key
              v.loading = true
              status = false
            }
          }
        )
        status?arr.push(item):null
        store.dispatch(REPLACE,{quickQuizArr:arr})
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
            that.initStatus('publish',that.$route.query.recordId)
            store.dispatch(REPLACE,{id:that.$route.query.recordId}).then(
              () =>{
                that._reload_ask(false,that.$route.query.recordId)
              }
            )

            doSomething(URL.requestHost+PUBLISHORTRAIN,params).then(
              (res) =>{

              }
            ).catch(
              (err) =>{
                that.$message({
                  type: 'error',
                  message: '服务器错误,请稍后重试',
                  duration:2000,
                });
                that.clearReloadId(err)
                store.dispatch(REPLACE,{mainLoading: false,loadingText:null})
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
