<template>
  <section class="p-relative">
    <section class="f-l done">
      <el-input class='searchInput middle' size = 'small' v-model="keyWords" placeholder="关键词搜索" @keyup.enter.native="search"><i slot="suffix" class="el-input__icon el-icon-search yoy-search-button" @click="search"></i>
      </el-input>
      <el-button :disabled='!status' type="primary" class="middle margin-left-20 big-button" @click="go('/bot/config/keywordResponse/addKeyword')">添加关键词</el-button><el-upload
        class="upload-demo"
        :headers="headers"
        :data="dataNew"
        :action="action"
        accept="file"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        :on-success = 'successUpload'
        :limit="1"
        :on-exceed="handleExceed"
      ><el-button size="small" type="primary">导入模版</el-button></el-upload>
      <span :class="status?['primary-color', 'download', 'margin-left-20'] : ['primary-color', 'download', 'margin-left-20', 'disabled']" @click="download">下载导入模版</span>
    </section>
    <section class="f-r">
      <el-button  v-show='status' type="primary" class="big-button" @click="dumpAll">清空数据</el-button>
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
      <el-table-column label="操作" :resizable="resizable" width="200">
        <template slot-scope="scope">
          <span class="hover edit" @click="go('/bot/config/keywordResponse/editAnswer')"><i class="el-icon-edit" ></i>编辑</span><span class='hover delete' style="margin-left: 24px" @click="doDelete(scope.row, scope.$index)"><i class="el-icon-close"></i>删除</span>
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
  import {KEYWORDLIST, DELETEKEYWORD, KEYWORDLEADEXCEL, KEYWORDDOWNLOAD, KEYWORDCLEAR} from "../../../../constants/api";
  import { getCookies } from "../../../../utils/cookie";
  import {TOKEN} from "../../../../constants/constants";
  import store from '../../../../store/index';

  export default {
    data() {
      return {
        action: KEYWORDLEADEXCEL,
        headers: {
          'Access-Token':'0469D6386D22D4BEA6522451B5D5D0DB690DE56D2AFF59504D7C0453FDF139EF'
        },
        dataNew:{
          BotId:'6e42a832-b855-4439-8f60-7c2101f37bc3',
          TenantDomain:'admin@testbot.hightalk.ai',
          TenantId:'928d2511-6783-43c2-bde5-dcf059f55710'
        },
        doingStatus: false,
        keyWords: '',
        status: true,
        tableData: [{name: 'uouo', year: 'dafs'}],
        loading: false,
        resizable: false,
        PageIndex: 1,
        total: 0,
        fileList: []
      }
    },
    computed: {

    },
    created () {
      this.getList()
    },
    methods: {
      init () {
        this.tableData = []
        this.total = 0
      },
      go (v) {
        const query = this.$route.query
        this.$router.push(
          {
            path: v,
            query,

          }
        )
      },
      successUpload(){
        this.$message({
          type: 'success',
          message:'上传成功',
          duration: 2000
        })
      },
      async getList () {
        const that = this
        that.loading = true
        const BotId = this.$route.query.recordId
        const TenantId = store.state.app.userInfo.TenantId
        const TenantDomain = store.state.app.userInfo.Email
        const token = getCookies( TOKEN )
        const params = {
          headers: {
            'Access-Token': token
          },
          method: 'POST',
          body: JSON.stringify(  { BotId, TenantId, TenantDomain, PageIndex: this.PageIndex, KeyWord: this.keyWords, PageSize: 10 } )
        }
        request (
          KEYWORDLIST , params
        ).then(
          ( res ) => {
            that.clearData( res )
          }
        ).catch(
          () => {
            that.loading = false
          }
        )
      },
      clearData ( v ) {
        const data = v.ResultValue.filter (
          (v,key) => {
            v.CreateDate = moment(v).formData('YYYY-MM-DD')
          }
        )
        this.tableData = data
        this.total = v.TotalCount
        this.loading = false
      },
      handleCurrentChange (v) {
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
      download () {
        const token = getCookies( TOKEN )
        const params = {
          headers: {
            'Access-Token': token
          },
          method: 'POST',
          body: JSON.stringify( { id: this.$route.query.recordId } )
        }
        request( KEYWORDDOWNLOAD, params)
          .catch( () => {
            this.$message({
              type: 'error',
              message: '下载失败',
              duration: 2000
            });
          } )
      },
      dumpAll () {
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
      uploadContainer(v) {
        const input = this.$refs["pic"];
        input.click();
        // 监听change事件:
      },
      uploadHandle(v) {
        this.uploadExcel()
        // const that = this;
        // const file = v.target.files[0];
        // // 读取文件:
        // const reader = new FileReader();
        // //获取文件名字
        // const name = file.name;
        // reader.onload = function(e) {
        //   that.uploadExcel(name, e )
        //   that.$refs["yoy-upload-excel"].value = "";
        // };
        // // 以DataURL的形式读取文件:
        // reader.readAsDataURL(file);
        // // });
      },
      uploadExcel (name, file) {
        const id = this.$route.query.recordId
        const someFile = document.getElementById('upload')
        const formData = new FormData(someFile);
        const TenantDomain = store.state.app.userInfo.Email
        formData.append('BotId', id);
        formData.append('TenantDomain', TenantDomain);
        formData.append('TenantId', '928d2511-6783-43c2-bde5-dcf059f55710');

        const params = {
          headers: {
            'Access-Token': getCookies( TOKEN ),
            'Content-Type': 'multipart/form-data;charset=UTF-8',
          },
          method: "POST",
          processData: false,
          body: formData
        }
        request( KEYWORDLEADEXCEL ,  params)
          .then(
            (res) => {
              console.log(res);
            }
          )
          .catch(
            (err) => {
              console.log(err);
            }
          )
      },
      doDumpAll() {
        const that = this
        const BotId = that.$route.query.recordId
        const TenantId = store.state.app.userInfo.TenantId
        const TenantDomain = store.state.app.userInfo.Email
        const params = {
          headers: getCookies( TOKEN ),
          methods: 'POST',
          body: JSON.stringify( { TenantId, TenantDomain, BotId} )
        }
        request( KEYWORDCLEAR,  params).then( () => {
            that.PageIndex = 1
            that.keyWords = ''
            // that.getList()
            that.$message({
              type: 'success',
              message: '清空成功',
              duration: 2000,
            });
          } ).catch( () => {
            that.$message({
              type: 'error',
              message: '清空失败',
              duration: 2000
            });
          })
      },
      search() {
        this.PageIndex = 1
        this.getList()
      },
      openIt () {
        this.status = true
      },
      closedIt(v) {
        this.status = false
      },
      doDelete (id, index) {
        this.$confirm('此操作将删除此条关键词回复, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteSingle (id, index)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作',
            duration: 2000
          });
        });
      },
      deleteSingle (id, index) {
        const params = {
          headers: {
            'Access-Token': getCookies( TOKEN )
          },
          methods: 'POST',
          body: JSON.stringify( id )
        }

        request( DELETEKEYWORD, params)
          .then ( () => {
            this.$message( {
              type: 'success',
              message: '删除成功',
              duration: 2000,
            } )
          } )
          .catch( () => {
            that.$message( {
              type: 'error',
              message: '删除失败',
              duration: 2000
            } )
          } )
        const that = this
        this.tableData.splice( index, 1 )
        this.total -- ;

        if(this.total%this.PageSize === 0){
          if(that.PageIndex !== 1){
            that.PageIndex --
          }
          that.getList()
        }
      }
    }
  }
</script>
<style lang="scss">
  @import "../../../../style/index.scss";
  .upload-demo {
    vertical-align: middle;
    display: inline-block;
    margin-left: 20px;
    .el-upload-list {
      display: none;
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
