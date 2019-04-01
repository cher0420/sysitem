<template>
  <section class="p-relative">
    <section class="f-l done">
      <el-input class='searchInput middle' size = 'small' v-model="keyWords" placeholder="关键词搜索" @keyup.enter.native="search"><i slot="suffix" class="el-input__icon el-icon-search yoy-search-button" @click="search"></i>
      </el-input>
      <el-button :disabled='!status' type="primary" class="middle margin-left-20 big-button" @click="go('/bot/config/keywordResponse/addKeyword')">添加关键词</el-button>
      <el-upload
        class="upload-demo"
        ref="upload"
        :disabled=' !status || uploadStatus '
        :headers="params.headers"
        :data="params.body"
        :action="params.url"
        accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        :on-success='successUpload'
        :on-error='onError'
        :limit="1"
        :on-exceed="handleExceed"
      ><el-button :disabled=' !status || uploadStatus ' size="small" type="primary" class="big-button">导入关键词 </el-button></el-upload>
      <a :href='status?"../../../../../static/file/template.csv":"javascript:;"' :class="status?['primary-color', 'download', 'margin-left-20'] : ['primary-color', 'download', 'margin-left-20', 'disabled']">下载导入模版</a>
    </section>
    <section class="f-r">
      <el-button  :disabled='tableData.length === 0' v-show='tableData.length !== 0' type="primary" class="big-button" @click="dumpAll">清空数据</el-button>
      <el-button  v-show='status' type="danger" class=" stop" @click="closedIt">停用</el-button>
      <el-button  v-show='!status' type="primary" @click="openIt">开启</el-button>
    </section>
    <el-table
      v-loading="loading"
      :data="tableData"
      border
      stripe="true"
    >
      <el-table-column label="序号" align="center" width='90' :resizable="resizable">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>

      </el-table-column>
      <el-table-column prop="Keyword" label="关键词" :resizable="resizable"></el-table-column>
      <el-table-column prop="CreateDate" label="创建时间" :resizable="resizable"></el-table-column>
      <el-table-column label="操作" :resizable="resizable" width="280">
        <template slot-scope="scope">
          <span :class="status?['hover','edit']:['disabled','hover','edit']" @click="go('/bot/config/keywordResponse/updateAnswer', '编辑', scope.row.ID )"><i class="el-icon-edit" ></i>编辑</span><span :class="status?['hover','delete']:['hover','delete','disabled']" style="" @click="doDelete(scope.row.ID, scope.$index)"><i class="el-icon-close"></i>删除</span>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @current-change="handleCurrentChange"
      background
      class="pagination"
      layout="total, prev, pager, next"
      :current-page.sync="Page"
      :total="total">
    </el-pagination>
    <div v-if='uploadResponseStatus' style="z-index: 2004;background: rgba(0, 0, 0, 0.4);" class="el-message-box__wrapper">
      <div :class="uploadResponseStatus?['el-message-box','responseBack']:['el-message-box','nonBack']">
        <div class="el-message-box__header">
          <div class="el-message-box__title">
            <span >提示</span>
          </div>
        </div>
        <div class="el-message-box__content">
            <div class="el-message-box__status el-icon-warning">
            </div>
            <div class="el-message-box__message">
              <p>{{response.Message}}</p>
            </div>
          </div><div class="el-message-box__btns">
          <button class="el-button el-button--small" @click="operate('Cancel')">取消上传</button>
          <button class="el-button el-button--small el-button--primary" @click="operate('SkipDuplicates')">跳过</button>
          <button class="el-button el-button--small el-button--primary margin-left-20" @click="operate('Overrides')">覆盖</button>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
  import moment from 'moment'
  import {request} from "../../../../serive/request";
  import {KEYWORDLIST, DELETEKEYWORD, KEYWORDLEADEXCEL, KEYWORDCLEAR, KEYWORDENABLE, KEYWORDSTATUS} from "../../../../constants/api";
  import { getCookies } from "../../../../utils/cookie";
  import {TOKEN} from "../../../../constants/constants";
  import store from '../../../../store/index';
  import { REPLACE } from "../../../../store/mutations";

  export default {
    data() {
      return {
        params: {},
        keyWords: '',
        status: true,
        tableData: [],
        loading: false,
        resizable: false,
        PageSize:10,
        Page: 1,
        total: 0,
        fileList: [],
        fileListArr: [],
        webSocket: null,
        uploadStatus: false,
        response:{ Message: '' },
        uploadResponseStatus: false,
        serverTimeoutObj: null,
      }
    },
    created() {
      this.getList()
      this.getServiceStatus()
      const id = JSON.parse(sessionStorage.getItem('recordId'))
      const BotId = this.$route.query.recordId?this.$route.query.recordId:id
      this.params = {
        headers: {'Access-Token': getCookies(TOKEN)},
        url: KEYWORDLEADEXCEL,
        // url: `http://192.168.50.198${KEYWORDLEADEXCEL}`,
        body: {
          BotId,
          TenantDomain: store.state.app.userInfo.Email,
          TenantId: store.state.app.userInfo.TenantId
        }
      }
      this.webSocketFun()
    },
    destroyed(){
      this.webSocket.close()
      store.dispatch( REPLACE, { mainLoading: false } )
    },
    methods: {
      init() {
        this.tableData = []
        this.total = 0
      },
      getServiceStatus () {
        const that = this
        store.dispatch(REPLACE,{mainLoading: true})
        const id = JSON.parse(sessionStorage.getItem('recordId'))
        const BotConfigId = this.$route.query.recordId?this.$route.query.recordId:id
        const params = {
          method: 'POST',
          headers: {
            'Access-token': getCookies(TOKEN)
          },
          body:  JSON.stringify( { BotConfigId } )
        }
        request( KEYWORDSTATUS, params ).then(
          (res) => {
            that.status = res.Data.Enable
            store.dispatch(REPLACE,{mainLoading: false})
          }
        ).catch( () => {
            that.status = false
        } )
      },
      successUpload (res, file, fileList) {
        if(!res.Status){
          this.$message(
            {
              type: 'error',
              message: `${res.ErrorMsg}请稍后重试`,
              duration: 2000
            }
          )
        }
        this.$refs.upload.clearFiles();
      },
      onError (err, file, fileList) {
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
        else{
          return
        }

      },
      async getList() {
        const that = this
        that.loading = true
        const id = JSON.parse(sessionStorage.getItem('recordId'))
        const BotId = this.$route.query.recordId?this.$route.query.recordId:id
        const TenantId = store.state.app.userInfo.TenantId
        const TenantDomain = store.state.app.userInfo.Email
        const token = getCookies(TOKEN)
        const params = {
          headers: {
            'Access-Token': token,
          },
          method: 'POST',
          body: JSON.stringify({
            BotId,
            TenantId,
            TenantDomain,
            Page: Math.abs(this.Page-1),
            KeyWord: this.keyWords,
            PageSize: 10
          })
        }
        request(
          KEYWORDLIST, params
        ).then(
          (res) => {
            that.clearData(res)
          }
        ).catch(
          () => {
            that.loading = false
          }
        )
      },
      heartCheck(){
        const that = this
        return {
          timeout: 3000,        // 9分钟发一次心跳，比server端设置的连接时间稍微小一点，在接近断开的情况下以通信的方式去重置连接时间。
          // serverTimeoutObj: null,
          reset: function(){
            console.log(that.serverTimeoutObj)
            clearTimeout(that.serverTimeoutObj);
            return this;
          },
          start: function(){
            console.log('进入')
            console.log(that.serverTimeoutObj)
            that.serverTimeoutObj = setInterval(function(){
              if(that.webSocket.readyState == 1){
                console.log("连接状态，发送消息保持连接");
                that.webSocket.send("ping");
                that.heartCheck().reset(); // 如果获取到消息，说明连接是正常的，重置心跳检测
              }else{
                console.log("断开状态，尝试重连");
                that.webSocketFun();
              }
            }, this.timeout)
          }
        }
      },
      webSocketFun() {
        const that = this
        const id = JSON.parse(sessionStorage.getItem('recordId'))
        const BotConfigId = this.$route.query.recordId?this.$route.query.recordId:id
            const agreement = location.host.indexOf('localhost')> -1? 'ws':'wss'
            const url = `${agreement}://${location.host}/api/admin/keyword/ws?BotId=${BotConfigId}`
            const token = getCookies(TOKEN)
            that.webSocket = new WebSocket(url, token);

            that.webSocket.onopen = function (event) {
              that.heartCheck().reset();
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
              that.heartCheck().reset();
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
              that.heartCheck().start();
              console.log('关闭了',info)
            }
      },
      alertFun (res) {
          this.uploadResponseStatus = true
          this.response = res
      },
      operate (key) {
        const id = JSON.parse(sessionStorage.getItem('recordId'))
        const BotConfigId = this.$route.query.recordId?this.$route.query.recordId:id
        const params = {
          "Command": key,
          "BotId": BotConfigId,
          "Domain": this.response.Domain,
          "TenantId": store.state.app.userInfo.TenantId
        }
        this.webSocket.send( JSON.stringify(params) )
        if(key === 'Cancel'){
          this.$message({
            type: 'info',
            message: '已取消上传文件',
            duration: 2000
          })
        }
        this.uploadResponseStatus = false
      },
      clearData(v) {
        const data = v.ResultValue.Datas.slice(0)
        for (let i of data) {
          i.CreateDate = moment(i.CreateDate).format('YYYY-MM-DD')
        }
        this.tableData = data
        this.total = v.ResultValue.Total
        this.loading = false
      },
      handleCurrentChange(v) {
        this.getList()
      },
      handleExceed(files, fileList) {
        this.$message.warning(`请依次上传文件`);
      },
      dumpAll() {
        this.$confirm('此操作将清空所有关键词回复, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.doDumpAll()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作',
            duration: 2000
          });
        });

      },
      doDumpAll() {
        const that = this
        const id = JSON.parse(sessionStorage.getItem('recordId'))
        const BotId = this.$route.query.recordId?this.$route.query.recordId:id
        const TenantId = store.state.app.userInfo.TenantId
        const TenantDomain = store.state.app.userInfo.Email
        const params = {
          headers: {
            'Access-Token': getCookies(TOKEN)
          },
          method: 'POST',
          body: JSON.stringify({TenantId, TenantDomain, BotId})
        }
        request(KEYWORDCLEAR, params).then(() => {
          that.Page = 1
          that.keyWords = ''
          that.loading = true
          that.$message({
            type: 'success',
            message: '清空成功',
            duration: 2000,
            onClose() {
              that.getList()
            }
          });
        }).catch(() => {
          that.$message({
            type: 'error',
            message: '清空失败',
            duration: 2000
          });
        })
      },
      search() {
        if (!(/^[0-9a-zA-Z\u4e00-\u9eff]{1,}$/).test(this.keyWords)&&this.keyWords) {
          this.$message({
            type: 'error',
            message: "请不要输入特殊字符作为关键词搜索，例如 *，<，>，%，;，/，?，'，_等",
            duration: 2000,
          })
          return
        }
        this.Page = 1
        this.getList()
      },
      openIt() {
        // this.$confirm('确定开启关键词回复功能?', '提示', {
        //   confirmButtonText: '确定',
        //   cancelButtonText: '取消',
        //   type: 'warning'
        // }).then(() => {
          this.doEnale(this.status)
        // }).catch(() => {
        //   this.$message({
        //     type: 'info',
        //     message: '已取消开启'
        //   });
        // });
      },
      closedIt(v) {
        this.$confirm('确定停用关键词回复功能?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.doEnale(this.status)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消停用'
          });
        });

      },
      doEnale(v) {
        store.dispatch(REPLACE, {mainLoading: true})
        const that = this
        this.status = !this.status
        const id = JSON.parse(sessionStorage.getItem('recordId'))
        const BotConfigId = this.$route.query.recordId?this.$route.query.recordId:id
        const params = {
          headers: {
            'Access-token': getCookies(TOKEN)
          },
          method: 'POST',
          body: JSON.stringify({BotConfigId, Enable: this.status,})
        }
        request(KEYWORDENABLE, params).then(
          (res) => {
            store.dispatch(REPLACE, {mainLoading: false})
            that.$message({
              type: 'success',
              message: '操作成功',
              duration: 2000
            })
          }
        ).catch(
          (err) => {
            that.$message({
              type: 'error',
              message: '操作失败',
              duration: 2000
            })
          }
        )
      },
      doDelete(id, index) {
        if(this.status){
          this.$confirm('此操作将删除此条关键词回复, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.deleteSingle(id, index)
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除',
              duration: 2000
            });
          });
        }
      },
      deleteSingle(ID, index) {
        const that = this
        const params = {
          headers: {
            'Access-Token': getCookies(TOKEN)
          },
          method: 'DELETE',
        }

        const tenantDomain = store.state.app.userInfo.Email
        const id = JSON.parse(sessionStorage.getItem('recordId'))
        const botId = this.$route.query.recordId?this.$route.query.recordId:id

        const url = encodeURI(`${ DELETEKEYWORD }${tenantDomain}/${botId}/${ID}`)

        request(url, params).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功',
            duration: 2000,
          })
          this.loading = true
          this.tableData.splice(index, 1)
          this.total--;
          if (this.total % this.PageSize === 0) {
            if (that.Page !== 1) {
              that.Page--
            }
            setTimeout(
              () => {
                that.getList()
              }, 800
            )
          }

        }).catch(() => {
          that.$message({
            type: 'error',
            message: '删除失败',
            duration: 2000
          })
        })
      }
    }
  }
</script>
<style scoped lang="scss">
  @import "../../../../style/index.scss";
  .middle{
    vertical-align: middle;
  }
  .margin-left-20{
    margin-left: 20px;
  }
  .download{
    cursor: pointer;
  }
  .download:hover{
    opacity: 0.8;
    text-decoration: underline;
  }
  .f-l{
    float: left;
  }
  .f-r{
    float: right;
  }
  /*component*/
  .done {
    margin-bottom: 20px;
  }
  .transition{
      transition: margin 1s;
  }
  /*do some thing*/
  .hover {
    i {
      margin-right: 6px;
      font-weight: 500;
    }
  }
  .hover:hover {
    text-decoration: underline;
    cursor: pointer;
  }
  .edit {
    color: #6c6c6c;
  }
  .edit:hover {
    color: $primary-color;
  }
  .delete {
    color: #999;
    margin-left: 24px;
  }
  .delete:hover {
    color: $danger;
  }
  .disabled.delete, .disabled.edit{
    color: $disabled;
    text-decoration: none;
  }
  .stop{
    background: $danger;
    color: $fff;
  }
  .stop:hover{
    background: $fff;
    color: $danger;
  }
  .has-stop{
    position: absolute;
    right: 0;
  }
  .do{
    text-align: right;
    margin-right: -100px;
  }
  //view
  .responseBack {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate( -50%, -50%);
    transition: transform 1s;
}
  .nonBack{
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate( -50%, -50%);
    transition: transform 1s;
  }
</style>
