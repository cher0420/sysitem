<template>
  <section class="p-relative">
    <section class="f-l done">
      <el-input class='searchInput middle' size = 'small' v-model="keyWords" placeholder="关键词搜索" @keyup.enter.native="search"><i slot="suffix" class="el-input__icon el-icon-search yoy-search-button" @click="search"></i>
      </el-input><el-button :disabled='!status' type="primary" class="middle margin-left-20 big-button">添加关键词</el-button><input
        type="file"
        accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        class="el-upload__input"
        style="display: none"
        ref="yoy-upload"
        @change="uploadHandle"
      /><el-button :disabled='!status' type="primary" class="middle big-button margin-left-20" @click="uploadContainer">导入关键词</el-button>
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
  import {KEYWORDLIST, DELETEKEYWORD, KEYWORDLEADEXCEL, KEYWORDDOWNLOAD} from "../../../../constants/api";
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
        const input = this.$refs["yoy-upload"];
        input.click();
        // 监听change事件:
      },
      uploadHandle(v) {

        const that = this;
        const file = v.target.files[0];
        const type = file.type;
        if (!/image\/\w+/.test(type) || file.type.indexOf("svg") > -1) {
          this.$message({
            type: "error",
            message: "只能上传jpg, jpeg, png, gif格式类型的图片"
          });
          return;
        }
        if (!file || file.size > 200 * 1024) {
          this.$message({
            type: "error",
            message: "请上传文件不大于200KB的图片！"
          });
          return;
        }
        // 读取文件:
        const reader = new FileReader();
        //初始化图像对象
        let obj = {};
        //获取文件名字
        const name = file.name;
        reader.onload = function(e) {
          const KnowledgeBase = e.target.result;

          //图像对象赋值
          // debugger;
          const type = name.substring(name.lastIndexOf(".")).replace(".", "");
          obj = {
            name,
            KnowledgeBase,
            type
          };
          that.defaultState === 'first'? that.uploadList.push(obj): that.uploadList2.push(obj);//需要根据类型增加不同的图片

          that.$refs["yoy-image-upload"].value = "";
        };
        // 以DataURL的形式读取文件:
        reader.readAsDataURL(file);
        // });

      },
      doDumpAll() {
        const that = this
        const params = {
          headers: getCookies( TOKEN ),
          methods: 'POST',
          body: JSON.stringify( {ID : this.$route.query.recordId} )
        }
        request( DELETEKEYWORD,  params) //清空数据
          .then( () => {
            that.PageIndex = 1
            that.keyWords = ''
            that.getList()
            that.$message({
              type: 'success',
              message: '清空成功!',
              duration: 2000,
            });
          } )
          .catch( () => {
            that.$message({
              type: 'error',
              message: '清空失败!',
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
