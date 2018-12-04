<template>
  <section>
    <section class="p-relative">
      <el-button type="primary" class="text-a-c createAnswer">创建新问答</el-button><el-input v-model='keys' class='searchInput' size = 'small' placeholder="输入关键词搜索" @keyup.enter.native="search"><i slot="suffix" class="el-input__icon el-icon-search yoy-search-button" @click="search"></i>
      </el-input>
        <el-button v-if="!enableChecked" class="p-absolute right-0" @click="typeCheckedStatus" style="-webkit-transition: 0s;-moz-transition: 0s;-ms-transition: 0 time;-o-transition: 0s;transition: 0s;color: #fff;background: #2a8ce7;border-color: #2a8ce7;">选择</el-button>
      <span v-else class="p-absolute right-0">
        <el-button class='cancel' style="width: 100px;padding-right: 0;padding-left: 0;margin-right: 10px;" @click="typeCheckedStatus">取消选择</el-button><el-button :disabled="buttonStatus" type="primary" style="margin-right: 10px;">测试</el-button><el-button type="primary" :disabled="buttonStatus" >发布</el-button>
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
          <el-checkbox v-model="scope.row.checkedStatus" v-if="enableChecked" @change="checked(scope.row.checkedStatus,scope.row.ID,scope.$index)"></el-checkbox>
          <span v-else>{{scope.$index+1}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="Question"
        label="问题"
        >
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
          <section class="handle" >
            操作
          </section>
        </template>
        <template slot-scope="scope">
          <section class="handle">
            <span class="edit"><i class="el-icon-edit" style="margin-right: 5px;"></i><span>编辑</span></span><span class="delete" @click="handDel(scope.row.ID,scope.$index)"><i class="el-icon-close" style="margin-right: 5px;"></i><span>删除</span></span>
          </section>

        </template>
      </el-table-column>
    </el-table>
    <section class="p-relative">
      <el-pagination
        @current-change="handleCurrentChange"
        class="pagination p-absolute"
        background
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
  import {getList,del} from './service'

  export default {
    data() {
      return {
        loading: false,
        tableDataCopy:[],
        tableData: [],
        enableChecked: false,
        options: questionOptions.status,
        title:'状态',
        status:'',
        statusString:{0:'不可用',1:'未发布',2:'培训中',3:'已培训',4:'发布中',5:'已发布'},
        keys:'',
        total:0,
        PageIndex:1,
        arr:[],
        showDel:false,
        buttonStatus:true,
      }
    },
    /*
    生命周期函数
     */
    created(){
      /*
      获取初始列表
       */
      this.loading = true
      getList().then(
        (res) => {
          /*
          自定义列表内容
           */
          this.tableData  = res.Data
          this.total = res.TotalCount
          this.PageIndex = res.PageIndex
          this.loading = false
        }
      ).catch(
        (err) =>{
          /*
          抛出错误
           */
          this.$message({
            type:'error',
            message:'服务器异常，请稍后重试'
          })
        }
      )
    },
    methods: {
      renderProductId(h, {column}) {
        return h(DrapDown, {
            props: {
              options: questionOptions.status,
            },
          }
        );
      },
      handleCommand(command){
        this.title = this.options[command]
        this.status= command
        const status = {Status:this.status}
        this.keys = ''
        this.loading = true
        getList(status).then(
          (res) => {
            this.tableData = res['Data']
            this.total = res.TotalCount
            this.PageIndex = res.PageIndex
            this.loading = false
          }
        )
      },
      typeCheckedStatus(v){
        this.enableChecked = !this.enableChecked
        /*
        优化页面闪烁视觉不适
         */
        this.loading=true
        setTimeout(
          () => {
            this.showDel = !this.showDel
          },300
        )
        setTimeout(
          () =>{
            this.loading=false
          },600
        )
        /*
        当操作状态为取消选择时
        */
        if(!this.enableChecked){
          /*
            初始化列表复选框状态
          */
          this.tableData.forEach(
            (v) =>{
              v.checkedStatus = false
            }
          )
          /*
          初始化数组状态
          */
          this.arr = []
          const params = {
            Keys:this.keys,
            PageIndex:this.PageIndex,
            Status: this.status
          }
          getList(params).then(
            (res) => {
              console.log(res)
            }
          )

        }else{
          /*
          当操作状态时选择时，初始化arr
          */
          this.tableData.forEach(
            (v,index) =>{
              switch (v.checkedStatus) {
                case 3:
                  this.arr.push(v.ID)
                      break;
                case 5:
                  this.arr.push(v.ID)
                      break;
                default:
                  break;
              }
            }
          )
        }
      },
      search() {
        this.loading = true
        const Keys = {Keys:this.keys}
        getList(Keys).then(
          (res) => {
            this.tableData = res['Data']
            this.PageIndex = res.PageIndex
            this.total = res.TotalCount
            this.title = '状态'
            this.loading = false
          }
        ).catch(
          () => {

          }
        )
      },
      handDel(v,index) {
        this.$confirm('是否删除此条问题?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading=true
          const params = {
            QuickQuizId:v
          }
          del(params).then(
            (res) => {
              this.tableData.splice(index,1)
              this.total--;
              this.loading=false
              this.$message({
                type: 'success',
                message: '删除成功'
              });
            }
          ).catch(
            () =>{
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
      checked(v,id,index){
        /*
          选中时，arr添加ID，
         */
        if(v){
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

      }
    },

  }
</script>
<style scoped lang="scss">
  @import '../../../../style/index';
  .yoy-search-button{
    width: 32px!important;
    height:30px!important;
    line-height: 30px!important;
    margin-top:1px;
    margin-right: 1px;
    margin-bottom: 1px;
    background-color: $light-blue;
    cursor:pointer;
  }
  .el-icon-search:before {
    font-weight: 900;
    font-size: 14px;
    color: $primary-color;
  }
  .createAnswer{
    width: 100px;padding-left:0;padding-right:0;margin-right: 20px;
  }
  .searchInput{
    width: 360px;
  }
  .margin-top20{
    margin-top: 20px;
  }
  .handle{
    span:hover{
      cursor: pointer;
    }
    .edit:hover{
      color:$primary-color;
      span:hover{
        text-decoration: underline;
      }
    }
    .delete:hover{
      color:$danger;
      span:hover{
        text-decoration: underline;
      }
    }
  }
  .edit{
    margin-right: 20px;
  }
  .yoy-main .el-table .cell .yoy-dropDown{
    height: 28px;
    line-height: 28px;
    color:#333;
  }
  .yoy-dropDown:hover{
    cursor: pointer;
  }
</style>
