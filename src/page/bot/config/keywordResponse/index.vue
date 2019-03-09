<template>
  <section class="p-relative">
    <section class="f-l done">
      <el-input class='searchInput middle' size = 'small' v-model="keyWords" placeholder="关键词搜索" @keyup.enter.native="search"><i slot="suffix" class="el-input__icon el-icon-search yoy-search-button" @click="search"></i>
      </el-input>
      <el-button :disabled='!status' type="primary" class="middle margin-left-20 big-button" @click="go('/bot/config/keywordResponse/addKeyword')">添加关键词</el-button>
      <el-upload
        class="upload-demo"
        ref="upload"
        :headers="params.headers"
        :data="params.body"
        :action="params.url"
        accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :on-success = 'successUpload'
        :limit="1"
        :on-exceed="handleExceed"
      ><el-button :disabled='!status' size="small" type="primary" @click="importExcel">导入模版</el-button></el-upload>
      <!--<form id="form2" action="http://192.168.50.198/api/admin/keyword/kqa/upload" method="post" enctype="multipart/form-data" onsubmit="return false">-->
        <!--<input type="text" name="BotId" value="6e42a832-b855-4439-8f60-7c2101f37bc3" />-->
        <!--<input type="text" name="TenantId" value="928d2511-6783-43c2-bde5-dcf059f55710" />-->
        <!--<input type="text" name="TenantDomain" value="testbot" />-->
        <!--<input type="file" name="files" id="j_file" @change="upload"/>-->
      <!--</form>-->
      <a href='../../../../../static/file/key2.csv' :class="status?['primary-color', 'download', 'margin-left-20'] : ['primary-color', 'download', 'margin-left-20', 'disabled']">下载导入模版</a>
    </section>
    <section class="f-r">
      <el-button  :disabled='tableData.length === 0' v-show='status' type="primary" class="big-button" @click="dumpAll">清空数据</el-button>
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
          <span style="margin-left: 10px">{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="Keyword" label="关键词" :resizable="resizable"></el-table-column>
      <el-table-column prop="CreateDate" label="创建时间" :resizable="resizable"></el-table-column>
      <el-table-column label="操作" :resizable="resizable" width="280">
        <template slot-scope="scope">
          <span class="hover edit" @click="go('/bot/config/keywordResponse/editAnswer', '编辑')"><i class="el-icon-edit" ></i>编辑</span><span class='hover delete' style="margin-left: 24px" @click="doDelete(scope.row.ID, scope.$index)"><i class="el-icon-close"></i>删除</span>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @current-change="handleCurrentChange"
      background
      class="pagination"
      layout="total, prev, pager, next"
      :current-page.sync="PageIndex"
      :total="total">
    </el-pagination>
  </section>
</template>
<script>
  import moment from 'moment'
  import {request} from "../../../../serive/request";
  import {KEYWORDLIST, DELETEKEYWORD, KEYWORDLEADEXCEL, KEYWORDDOWNLOAD, KEYWORDCLEAR, KEYWORDENABLE} from "../../../../constants/api";
  import { getCookies } from "../../../../utils/cookie";
  import {TOKEN} from "../../../../constants/constants";
  import store from '../../../../store/index';
  import { REPLACE } from "../../../../store/mutations";
  import jq from 'jquery'
  import '../../../../../static/jquery.form'

  export default {
    data() {
      return {
        params: {},
        autoUpload: false,
        doingStatus: false,
        keyWords: '',
        status: true,
        tableData: [],
        loading: false,
        resizable: false,
        PageIndex: 1,
        total: 0,
        fileList: [],
        fileListArr: [],
        webSocket: null
      }
    },
    computed: {
      // headers () {
      //   return {
      //
      //   }
      // }
    },
    created() {
      this.params = {
        headers: {'Access-Token': getCookies(TOKEN)},
        url: KEYWORDLEADEXCEL,
        // url: `http://192.168.50.198${KEYWORDLEADEXCEL}`,
        body: {
          BotId: this.$route.query.recordId,
          TenantDomain: store.state.app.userInfo.FullName,
          TenantId: store.state.app.userInfo.TenantId
        }
      }
      this.getList()
    },
    beforeDestroy() {

    },
    destroyed(){
      store.dispatch( REPLACE, { mainLoading: false } )

    },
    methods: {
      importExcel() {
        this.webSocketFun()
      },
      upload() {
          jq('#form2').ajaxSubmit({
            type: 'post',
            dataType: 'json',
            success: function (responseText) {
              alert(responseText);
            }
          });
      },
      init() {
        this.tableData = []
        this.total = 0
      },
      go(v, title) {
        const query = this.$route.query
        this.$router.push(
          {
            path: v,
            query: {
              ...query,
              title: title
            },
          }
        )
      },
      successUpload() {
        const that = this
        store.dispatch( REPLACE, { mainLoading: true } ).then(
          () => {
            that.$refs.upload.clearFiles();
          }
        )
      },
      async getList() {
        const that = this
        that.loading = true
        const BotId = this.$route.query.recordId
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
            PageIndex: this.PageIndex,
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
      webSocketFun() {
        const that = this
        return new Promise(
          (resolve, reject) => {
            const id = this.$route.query.recordId
            // const url = `ws://localhost:3000/socket/ws?BotId=${id}`
            const url = `ws://192.168.50.198/ws?BotId=${id}`
            // const url = `/ws?BotId=${id}`
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
                  reject(false);
                  break;
              }
            };
            that.webSocket.onmessage = function (res) {
              const response = JSON.parse(res.data)
              if (response) {
                console.log('====_', JSON.parse(res.data));

                switch (response.Code) {
                  case "IRV00004":
                    store.dispatch( REPLACE, { mainLoading: false } )
                    that.$message({
                      type: 'error',
                      message: `${response.Message} 请重新上传`,
                      duration: 2000,
                    })
                        break;
                  case "IRV00003":
                    that.$confirm(`${response.Message}`, '提示', {
                      confirmButtonText: '覆盖',
                      cancelButtonText: '跳过',
                      type: 'warning',
                      closeOnPressEscape:false,
                      closeOnClickModal:false,
                      showClose:false,
                      distinguishCancelAndClose: true,
                    }).then(() => {
                      const params = {"Command":"Overrides","BotId": that.$route.query.recordId,"Domain":response.Domain,"TenantId":store.state.app.userInfo.TenantId}
                      that.webSocket.send( JSON.stringify(params) )
                    }).catch((action) => {
                      if( action === 'closed' ){
                        const params = {"Command":"Cancel","BotId": that.$route.query.recordId,"Domain":response.Domain,"TenantId":store.state.app.userInfo.TenantId}
                        that.webSocket.send( JSON.stringify(params) )
                      } else {
                        const params = {"Command":"SkipDuplicates","BotId": that.$route.query.recordId,"Domain":response.Domain,"TenantId":store.state.app.userInfo.TenantId}
                        that.webSocket.send( JSON.stringify(params) )
                      }
                    });
                    break;
                  case 'Succeed':
                    that.$message( {
                      type: 'success',
                      message: `${response.Message}`,
                      duration: 2000,
                    } )
                    store.dispatch( REPLACE, { mainLoading: false } )
                        break;
                  }
              }
            }
            that.webSocket.onerror = (err) => {
              console.log(err);
            }
            that.webSocket.onclose = (info) => {
              console.log(info);
            }
          }
        )

      },
      closed(callback) {
        this.$alert('<strong>这是 <i>HTML</i> 片段</strong>', 'HTML 片段', {
          dangerouslyUseHTMLString: true
        });
        // this.$confirm('取消后上传操作?', '提示', {
        //   confirmButtonText: '确定',
        //   cancelButtonText: '返回',
        //   type: 'warning'
        // }).then(() => {
        //   callback
        //   this.$message({
        //     type: 'success',
        //     message: '已取消上传!'
        //   });
        // })
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
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
      download() {
        window.open('../../../../../static/file/csv')
        // const token = getCookies( TOKEN )
        // const params = {
        //   headers: {
        //     'Access-Token': token
        //   },
        //   method: 'POST',
        //   body: JSON.stringify( { id: this.$route.query.recordId } )
        // }
        // request( KEYWORDDOWNLOAD, params)
        //   .catch( () => {
        //     this.$message({
        //       type: 'error',
        //       message: '下载失败',
        //       duration: 2000
        //     });
        //   } )
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
        const BotId = that.$route.query.recordId
        const TenantId = store.state.app.userInfo.TenantId
        const TenantDomain = store.state.app.userInfo.Email
        const params = {
          headers: getCookies(TOKEN),
          method: 'POST',
          body: JSON.stringify({TenantId, TenantDomain, BotId})
        }
        request(KEYWORDCLEAR, params).then(() => {
          that.PageIndex = 1
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
        const str = "<>%;/?'_"
        const index = this.keyWords && str.indexOf(this.keyWords) > -1
        if (index) {
          this.$message({
            type: 'error',
            message: "请不要输入特殊字符作为关键词搜索，例如 <，>，%，;，/，?，'，_等",
            duration: 2000,
          })
          return
        }
        this.PageIndex = 1
        this.getList()
      },
      openIt() {
        this.status = true
        this.doEnale(this.status)
      },
      closedIt(v) {
        this.status = false
        this.doEnale(this.status)
      },
      doEnale(v) {
        const that = this
        const BotConfigId = this.$route.query.recordId
        const params = {
          headers: {
            'Access-token': getCookies(TOKEN)
          },
          method: 'POST',
          body: JSON.stringify({BotConfigId, Enable: this.status,})
        }
        request(KEYWORDENABLE, params).then(
          (res) => {
            console.log(res)
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
        this.$confirm('此操作将删除此条关键词回复, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteSingle(id, index)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作',
            duration: 2000
          });
        });
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
        const botId = this.$route.query.recordId

        const url = encodeURI(`${ DELETEKEYWORD }${tenantDomain}/${botId}/${ID}`)

        request(url, params).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功',
            duration: 2000,
          })

          this.tableData.splice(index, 1)
          this.total--;

          if (this.total % this.PageSize === 0) {
            if (that.PageIndex !== 1) {
              that.PageIndex--
            }
            that.getList()
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
<style lang="scss">
  @import "../../../../style/index.scss";
  .upload-demo {
    vertical-align: middle;
    display: inline-block;
    position: relative;
    margin-left: 20px;
    .el-upload-list {
      position: absolute;
      top: - 38px;
    }
  }
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
  }
  .delete:hover {
    color: $danger;
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
</style>
