<template>
  <section class="p-relative">
    <section class="f-l done">
      <el-input class='searchInput middle' size = 'small' v-model="keyWords" placeholder="关键词搜索" @keyup.enter.native="search"><i slot="suffix" class="el-input__icon el-icon-search yoy-search-button" @click="search"></i>
      </el-input><el-button :disabled='!status' type="primary" class="middle margin-left-20 big-button">添加关键词</el-button><el-button :disabled='!status' type="primary" class="middle big-button" >导入关键词</el-button><span :class="status?['primary-color', 'download', 'margin-left-20'] : ['primary-color', 'download', 'margin-left-20', 'disabled']" @click="download">下载导入模版</span>
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
      <el-table-column prop="IntentName" label="关键词" :resizable="resizable"></el-table-column>
      <el-table-column prop="year" label="创建时间" :resizable="resizable"></el-table-column>
      <el-table-column label="操作" :resizable="resizable" width="200">
        <template slot-scope="scope">
          <span class="hover edit"><i class="el-icon-edit" ></i>编辑</span><span class='hover delete' style="margin-left: 24px" @click="delete(scope.row)"><i class="el-icon-close"></i>删除</span>
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
  import {request} from "../../../../serive/request";
  import {KEYWORDLIST, DELETEKEYWORD} from "../../../../constants/api";
  import { getCookies } from "../../../../utils/cookie";
  import {TOKEN} from "../../../../constants/constants";

  export default {
    data() {
      return {
        doingStatus: false,
        keyWords: '',
        status: true,
        tableData: [{name: 'uouo', year: 'dafs'}],
        loading: false,
        resizable: false,
        PageIndex: 1,
        total: 0
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
      async getList () {
        const that = this
        that.loading = true
        const BotConfigRecordId = this.$route.query.recordId
        const token = getCookies( TOKEN )
        const params = {
          headers: {
            'Access-Token': token
          },
          method: 'POST',
          body: JSON.stringify( { BotConfigRecordId, Data: { PageIndex: this.PageIndex, Key: this.keyWords, SkillNo: '', PageSize: 10 } } )
        }
        request (
          KEYWORDLIST , params
        ).then(
          ( res ) => {
            that.clearData( res )
          }
        ).catch()
      },
      clearData ( v ) {
        const data = v.Data.slice(0)
        this.tableData = data
        this.total = v.TotalCount
        this.loading = false
      },
      handleCurrentChange (v) {
        this.getList()
      },

      download () {
        this.keyWords = 'yoyo'
        console.log('下载的')
      },
      dumpAll () {
        console.log('删除全部')
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
      delete () {
        request(DELETEKEYWORD)
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
