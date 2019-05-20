<template>
  <section>
    <nav-title title="快速问答"></nav-title>
    <a :href="blankUrl" style="display: none" target="_blank" id="blankNew" ref="blankNew"></a>
    <section class="p-relative" style="">
      <el-button  v-if="!enableChecked" type="primary" class="text-a-c createAnswer" :disabled='!status' @click="newQA">创建新问答</el-button>
      <el-button type="primary"  size="small" class="text-a-c introduction" :disabled='!status' @click="uploadMessage = true">导入</el-button>

      <el-dialog
        title="提示"
        :visible.sync="uploadMessage"
        width="40%"
        top="300px"
        center>
        <div style="height:30px;">
          <div style="float:left;height:30px;">
            <span>上传文件:</span>
            <el-upload  class="uploadbtn"
                        ref="upload"
                        accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        :headers="params.headers"
                        :data="params.body"
                        :action="params.url"
                        :on-success='successUpload'
                        :on-error='onError'
                        :limit="1"
                        :on-exceed="handleExceed"
            >
              <el-button type="primary" >导入</el-button>
            </el-upload>
          </div>
          <div  >
            <span class="">已选取文件  </span>
            <ul class="el-upload-list el-upload-list--text" style="float:right;dispaly:inline;">
              <li tabindex="0" class="el-upload-list__item is-success">
                <a class="el-upload-list__item-name">   </a>
                <label class="el-upload-list__item-status-label">  </label>
              </li>
            </ul>
          </div>
        </div>
        <br><br>
        <p>1.点击 <a href="../../../../../static/file/qqatemplate.xlsx">下载文件</a>，按格式填写</p>
        <p>2.上传excel完成批量导入</p>
        <span slot="footer" class="dialog-footer">
            <el-button @click="uploadMessage = false">取 消</el-button>
            <el-button type="primary" @click="uploadMessage = false">确 定</el-button>
          </span>
      </el-dialog>

      <el-input v-model='keys' class='searchInput ' :style="{transition:'left .3s',}" size = 'small' placeholder="输入关键词搜索" @keyup.enter.native="search"><i slot="suffix" class="el-input__icon el-icon-search yoy-search-button" @click="search"></i>
      </el-input>
      <span  >
        <!-- v-if="!originDisabled" -->
        <span class="start-quickly p-absolute" v-show='startIt'>
          <el-button @click="clearAll" v-show="clearshow" >清空</el-button>
          <el-button class="btn-bg" @click="stop">开启</el-button>
        </span>
        <span v-show='!stopIt'>
          <el-button  class="item p-absolute red" disabled v-show='release' >发布</el-button>
          <el-badge is-dot  class="item p-absolute weight"  v-show='!release'>
            <el-button  @click="publish" type="primary">发布</el-button>
        </el-badge>
          <el-button type="primary" v-if="!enableChecked" @click="start" class= "p-absolute p-ting right-0"  style="-webkit-transition: 0s;-moz-transition: 0s;-ms-transition: 0 time;-o-transition: 0s;transition: 0s;" >停用</el-button>
          <span v-else class="p-absolute right-0">
            <!-- <el-button class='cancel' style="width: 100px;padding-right: 0;padding-left: 0;margin-right: 10px;" @click="typeCheckedStatus">取消编辑</el-button><el-button :disabled="tableDataCopy.length>0?false:true" type="primary" style="margin-right: 10px;" @click="train">培训</el-button><el-button type="primary" :disabled="tableDataCopy.length>0?false:true" @click="publish">发布</el-button> -->
           </span>
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
          <el-checkbox style="height: 24px;line-height: 24px;margin-bottom: 0" v-model="scope.row.QAStatus" v-if="enableChecked" @change="checked(scope.row.checkedStatus,scope.row.ID,scope.$index,scope.row.Status)"></el-checkbox>
          <span v-else>{{scope.$index+1}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="QuestionName"
        label="问题" show-overflow-tooltip
        :resizable="resizable"
      >
        <template slot-scope="scope">
          <section class='link' @click="pathToDetail(scope.row)">
            {{scope.row.QuestionName}}
          </section>
        </template>
      </el-table-column>
      <el-table-column
        prop="Domain"
        label="行业领域"
        width="160" show-overflow-tooltip
        :resizable="resizable"
        align="center"
      >
        <template slot-scope="scope">
          {{scope.row.Domain.replace(/,/g,'、')}}
        </template>
      </el-table-column>
      <el-table-column
        prop="QAStatusText"
        width="100"
        :resizable="resizable" >
        <template slot="header" slot-scope="scope">
          <el-dropdown @command="handleCommand" trigger='click' placement="bottom-start" class="p-absolute left-0 yoy-dropDown">
  <span class="el-dropdown-link c333">
    {{title}}<i class="el-icon-arrow-down el-icon--right"></i>
  </span>
            <el-dropdown-menu slot="dropdown" @command="handleCommand">
              <el-dropdown-item :command="key" v-for="(value, key, index) in options" :key="index">{{value}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
        <template slot-scope="scope"><span>{{scope.row.QAStatusText}}</span></template>
      </el-table-column>
      <el-table-column
        prop="CreateDate"
        label="更新时间"
        :resizable="resizable"
        align="center"
        :width="showDel?'320':'150'" >
      </el-table-column>
      <el-table-column
        width="200"
        :resizable="resizable"
        v-if="!showDel"
      >
        <template slot='header' slot-scope="scope">
          <section class="handle" style="height: 28px;line-height: 28px">
            操作
          </section>
        </template>
        <template slot-scope="scope">
          <section class="handle" style="line-height: 24px">
            <span :class="[scope.row.Status == '5'?'un-handle':'edit']" style="margin-right: 20px" @click="editSomething(scope.row)">
              <i class="el-icon-edit" style="margin-right: 5px;"></i>
              <span>编辑</span>
            </span>
            <span :class="[scope.row.Status == '5'?'un-handle':'delete']" @click="handDel(scope.row.Id,scope.$index,scope.row.Status)"><i class="el-icon-close" style="margin-right: 5px;"></i><span>删除</span></span>
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
  import {request} from "../../../../serive/request";
  import questionOptions from './constants'
  import {getList,del,_ask,doSomething} from './service'
  import URL from '../../../../host/baseUrl'
  import {GETQQASEVICE,UPDATEQQASEVICE,QQAEXCEL,QQADELETE,GETPUBLISHSTATUS,PUBLISH} from "../../../../constants/api";
  import store from '../../../../store';
  import {REPLACE,DETAILS} from "../../../../store/mutations"
  import {TOKEN} from "../../../../constants/constants";
  import { getCookies } from "../../../../utils/cookie";
  import{NavTitle} from "../../../../components/NavTitle"

  export default {
    data() {
      return {
        params: {},
        startIt:true,
        stopIt:true,
        release:false,
        webSocket: null,
        status:false,
        tableData: [],
        tableDataCopy:[],
        clearshow:true,
        uploadMessage:false,

        resizable:false,
        border:true,
        loading: false,

        dataContainer:[],

        enableChecked: false,
        options: {0:'全部',1:'未发布',  2: '已发布'},
        title:'状态',
        // dropStatus:'',
        statusString:{0:'全部',1:'未发布',  2: '已发布'},
        keys:'',
        total:0,
        PageIndex:1,
        PageSize:10,
        showDel:false,
        originDisabled:true,
        blankUrl:'',

      }
    },
    /*
    生命周期函数
     */
    created(){
      this.getSevice()
      //  this.checkSatus()
      this.reLoad() //导入
      this.tableData = []
      this.total = 0
      const id = JSON.parse(sessionStorage.getItem('recordId'))
      const botConfigId = this.$route.query.recordId?this.$route.query.recordId:id

      this.params = {
        headers: {'Access-Token': getCookies(TOKEN)},
        url: QQAEXCEL,
        // url: `http://192.168.50.198${QQAEXCEL}`,
        body: {
          botConfigId,
          tenantId: store.state.app.userInfo.TenantId
        }
      }
      const params = {}
      getList(params).then(
        (res) =>{
          that.tableData = res.Data.Result
          this.total = res.Data.TotalCount
          if (res['Data'].IsNeedPublished) {
            this.release=false
          } else {
            this.release=true
          }


        }
      )


      const that = this

    },
    destroyed(){
      // this.webSocket.close()
      store.dispatch(REPLACE,{mainLoading:false,loadingText:null})
    },
    methods: {
      // 查询发布状态
      checkSatus(){
        const TenantId = store.state.app.userInfo.TenantId
        const  BotRecordId = this.$route.query.recordId
        const params = {
          headers:{
            'Access-token': getCookies(TOKEN)
          },
          method: 'POST',
          body: JSON.stringify({
            BotRecordId,TenantId
          })
        }

        request(GETPUBLISHSTATUS, params).then(res => {
          if (res.Status=1) {
            //1为 未发布
            this.release=true
          } else {
            //2为已发布
            this.release=false
          }
        })

      },

      start(){
        const ID = sessionStorage.getItem("seviceId");
        // const BotConfigId = this.$route.query.recordId?this.$route.query.recordId:id
        const TenantId = store.state.app.userInfo.TenantId
        const Enable = false
        const  BotRecordId =   this.$route.query.recordId
        const params = {
          headers:{
            'Access-token': getCookies(TOKEN)
          },
          method: 'POST',
          body: JSON.stringify({
            ID,Enable,BotRecordId,TenantId
          })
        }
        request(UPDATEQQASEVICE, params).then(res => {
        });
        this.startIt =true
        this.stopIt =true
        this.status=false
      },
      stop(){
        const ID = sessionStorage.getItem("seviceId");
        const TenantId = store.state.app.userInfo.TenantId
        const Enable = true
        const  BotRecordId =   this.$route.query.recordId
        const params = {
          headers:{
            'Access-token': getCookies(TOKEN)
          },
          method: 'POST',
          body: JSON.stringify({
            ID,Enable,BotRecordId,TenantId
          })
        }
        request(UPDATEQQASEVICE, params).then(res => {
        });
        this.startIt =false
        this.stopIt =false
        this.status=true
      },
      getSevice(){
        const that = this
        const TenantId = store.state.app.userInfo.TenantId
        const ServiceType = '1'
        const  BotRecordId =  this.$route.query.recordId
        const token = getCookies(TOKEN)
        const params = {
          headers: {
            'Access-Token': token,
          },
          method: 'POST',
          body: JSON.stringify({
            BotRecordId,TenantId,ServiceType,
          })
        }
        request(GETQQASEVICE, params).then(res => {
          // cunid
          const ID = res.Data.Id
          sessionStorage.setItem("seviceId",res.Data.Id);
          if (res.Data.Enable) {
            // true 为开启状态 ，停用按钮
            this.startIt =false
            this.stopIt =false
            this.status=true
          } else {
            // false  显示开启按钮
            this.startIt =true
            this.stopIt =true
            this.status=false
          }
        });

      },
      getlistAgain(){

      },

      clearAll(){
        const TenantId = store.state.app.userInfo.TenantId
        const BotRecordId = this.$route.query.recordId//route.currentRoute.query.recordId

        const DeleteType = 2
        const token = getCookies(TOKEN)
        const params = {
          headers: {
            'Access-Token': token,
          },
          method: 'POST',
          body: JSON.stringify({
            BotRecordId,TenantId,DeleteType,
          })
        }
        request(QQADELETE, params).then(res => {
          this.tableData = []
          this.clearshow=false
        });




      },

      reLoad(){
        const that = this
        that.webSocketFun()
        this.setInterval = setInterval(
          () => {
            that.webSocket.close()
            that.webSocketFun()
          }, 1740000
        )
      },

      successUpload (res, fileInfo, fileList) {
        if(!res.Status){
          this.$message(
            {
              type: 'error',
              message: `${res.ErrorMsg}请稍后重试111`,
              duration: 2000
            }
          )
        }
        this.$refs.upload.clearFiles();
        const that =this


        const params = {
          // PageIndex: this.PageIndex,
          // Status: this.status,
          // Keys:this.keys
        }

        getList(params).then((res) =>{
          console.log(res.Data.Result)
          // that.complateGetList(res)
          this. tableData=res.Data.Result
          this.handleCurrentChange()
        })
      },
      onError (err, fileInfo, fileList) {
        this.$message(
          {
            type: 'error',
            message: '服务器错误，请稍后重试',
            duration: 2000
          }
        )
        this.$refs.upload.clearFiles();
      },
      go(v, title, ID = undefined) {
        if(this.status){
          const query = this.$route.query
          this.$router.push(
            {
              path: v,
              query: {
                ...query,
                title: title,
                ID: ID
              },
            }
          )
        }
      },
      handleExceed(fileInfo, fileList) {
        this.$message.warning(`请依次上传文件`);
      },
      webSocketFun() {
        const that = this
        if(this.reloadNum >= 10){
          that.$notify({
            title: '提示',
            message: '与服务器连接已安全断开，如需上传文件，请刷新页面',
            duration: 0,
          });
          clearInterval(that.setInterval)
          return
        }
        this.reloadNum++
        const id = JSON.parse(sessionStorage.getItem('recordId'))
        const BotConfigId = this.$route.query.recordId?this.$route.query.recordId:id
        const agreement = location.host.indexOf('localhost')> -1? 'ws':'wss'
        const url = `${agreement}://${location.host}/api/admin/qqa/ws?BotId=${BotConfigId}`
        // const url = `ws://192.168.50.198/ws?BotId=${BotConfigId}`
        const token = getCookies(TOKEN)
        that.webSocket = new WebSocket(url, token);

        that.webSocket.onopen = function (event) {
          switch (event.currentTarget.readyState) {
            case 0:
              that.$refs.upload.abort()
              that.$refs.upload.clearFiles()
              that.$message({
                type: 'error',
                message: '上传功能暂时不能使用，请稍后重试',
                duration: 2000
              })
              that.uploadStatus = true
              break;
            default:
              that.uploadStatus = false
          }
        };
        that.webSocket.onmessage = function (res) {
          // that.heartCheck().reset();
          const response = JSON.parse(res.data)
          if (response) {
            switch (response.Code) {
              case "IRV00002" || "IRV00006":
                that.$message({
                  type: 'error',
                  message: `${response.Message} 请重新上传`,
                  duration: 2000,
                })
                store.dispatch( REPLACE, { mainLoading: false } )
                break;
              case "IRV00003":
                that.alertFun(response);
                break;
              case 'Succeed':
                that.loading = true
                that.$message( {
                  type: 'success',
                  message: `${response.Message}`,
                  duration: 2000,
                  onClose(){
                    that.getList()
                  }
                } )
                store.dispatch( REPLACE, { mainLoading: false } )
                break;
              default:
                that.$message({
                  type: 'error',
                  message: `${response.Message} 请重新上传`,
                  duration: 2000,
                })
                store.dispatch( REPLACE, { mainLoading: false } )
            }
          }
        }
        that.webSocket.onerror = (err) => {

        }
        that.webSocket.onclose = (info) => {
          // that.heartCheck().start();
          console.log('关闭了',info)
        }
      },
      alertFun (res) {
        this.uploadResponseStatus = true
        this.response = res
      },

      newQA() {
        const query = this.$route.query;
        // this.newDataDis(); // 进入创建问题 首页s
        this.$router.push({
          path:'/bot/config/quicklyQA/createNewQA',
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
            path:'/bot/config/quicklyQA/edit',
            query:{
              // ...query,
              recordId:query.recordId,
              questionId: v.Id,
              // title:v.Question,
              // v
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
        const url = `/WebTalk/validaiml.html?id=${BotConfigId}`
        this.blankUrl = url



        var e = document.createEvent('MouseEvents');
        e.initEvent('click', true, true);
        theAnchor[0].dispatchEvent(e);

        theAnchor.remove();
      },

      handleCurrentChange(v) {
        this.loading = true
        this.PageIndex = v
        const options = {
          PageIndex: this.PageIndex,
          Status: this.command,

        }
        getList(options).then(
          (res) =>{
            console.log(res, 're')
            res['Data'].Result.forEach(
              (v,index) =>{
                console.log(v, 'current')
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
        this.tableData= res['Data'].Result
        // this.originDisabled = this.tableData.length <= 0
        this.total = res.Data.TotalCount
        this.PageIndex = res.Data.PageIndex
        this.loading = false
        // this.release=true
      },
      handleCommand(command){
        const that = this
        this.status = command-0
        const id = JSON.parse(sessionStorage.getItem('recordId'))
        const botConfigId = this.$route.query.recordId?this.$route.query.recordId:id

        this.params = {
          body: {
            Status: this.status
          }
        }
        const params = {Status: this.status}
        getList(params).then(
          (res) =>{
            that.tableData = res.Data.Result

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
        this.keyword   = this.keys
        getList({keyword:this.keys}).then(
          (res) => {
            res.Data.Result.forEach(

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
              // if(this.total%this.PageSize === 0){
              //   if(this.PageIndex !== 1){
              //     this.PageIndex --
              //   }

              // }
              const params = {
                PageIndex: this.PageIndex,
                Status: this.command,
              }
              getList(params).then((res) =>{
                that.complateGetList(res)
              })
              //改发布状态
              this.release=false
              store.dispatch(REPLACE,{mainLoading:false})
              this.$message({
                type: 'success',
                message: '删除成功'
              });
              // that.complateGetList(res)
            }
          ).catch(
            () =>{
              store.dispatch(REPLACE,{mainLoading:false})
              this.$message({
                type: 'success',
                message: '删除成功'
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
          store.dispatch(REPLACE,{id:that.$route.query.recordId})

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
        this.loading = true
        const params = {
          TenantId: store.state.app.userInfo.TenantId ,
          BotRecordId : this.$route.query.recordId
        }
        that.initStatus('publish',that.$route.query.recordId)

        doSomething(URL.requestHost+PUBLISH,params).then(
          (res) =>{
            this.loading = false
            that.$message({
              type:'success',
              message:'发布成功',
              duration:2000,
            })
          }
        ).catch(
          (err) =>{
            this.loading = false
            that.$message({
              type:'error',
              message:'服务器错误',
              duration:2000,
            })
          }
        )
        store.dispatch(REPLACE,{id:that.$route.query.recordId}).then(
          () =>{
            getList().then(
              (res) => {
                this.complateGetList(res)
                this.title = '状态'
                this.release=true
                //发布状态要改成已发布 check123
                this.tableData=res.Data.Result
              })


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


      },



    }
  }
</script>
<style scoped lang="scss">
  @import '../../../../style/index';
  @import '../../../../style/var/color';
  .c333{
    color: $bold-color;
  }
  .createAnswer{
    position: absolute;
    top:18px;left:380px;
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
  .item {
    margin-top: 10px; top:8px;
    margin-right: 40px;right: 60px;background: #2a8ce7;padding:6px 20px;color: #fff;box-sizing:border-box; font-size: 14px;border-radius: 2px;
  }
  .introduction{position:absolute;top:18px;left:500px;}
  .start-quickly{top:17px;right:0;
    .btn-bg{background: #2a8ce7;color:#fff;}
  }
  .red{padding:8px 20px;background:#95c6f3!important;}
  .red:disabled{color:#fff;}
  .weight{padding:0;}
  .uploadbtn{display: inline;margin-right: 50px;}
  .uploadText{display: inline-block;float: right;}
  .searchInput{top:18px;}
  .p-ting{top:18px;background:red;border:1px solid red;}
</style>
