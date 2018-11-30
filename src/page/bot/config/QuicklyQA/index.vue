<template>
  <section>
    <section class="p-relative">
      <el-button type="primary" class="text-a-c createAnswer">创建新问答</el-button><el-input class='searchInput' size = 'small' placeholder="输入关键词搜索" @keyup.enter.native="search"><i slot="suffix" class="el-input__icon el-icon-search yoy-search-button" @click="search"></i>
      </el-input>
      <span v-if="!enableChecked" class="p-absolute right-0">
        <el-button type="primary" @click="typeCheckedStatus" style="-webkit-transition: 0s;-moz-transition: 0s;-ms-transition: 0 time;-o-transition: 0s;transition: 0s;">选择</el-button>
      </span>
      <span v-else class="p-absolute right-0">
        <el-button type="primary" style="width: 100px;padding-right: 0;padding-left: 0;margin-right: 10px;" @click="typeCheckedStatus">取消选择</el-button><el-button type="primary" style="margin-right: 10px;">测试</el-button><el-button type="primary" >发布</el-button>
      </span>
    </section>
    <el-table
      :data="tableData"
      stripe
      border
      style="width: 100%;margin-top: 20px;">
      <el-table-column
        prop="index"
        label="序号"
        width="90"
        align="center"
      >
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.checkedStatus" v-if="enableChecked"></el-checkbox>
          <span v-else>{{scope.$index+1}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="date"
        label="问题"
        >
      </el-table-column>
      <el-table-column
        prop="StatusString"
        :render-header="renderProductId"
        min-width="30"
      >
        <template slot-scope="scope">
          <span>
            {{ scope.row.StatusString }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="date"
        label="创建时间"
        min-width="30"
      >
      </el-table-column>
      <el-table-column
        prop="address"
        label="操作"
        min-width="30"
      >
        <template slot-scope="scope">
          <section class="handle">
            <span class="edit"><i class="el-icon-edit" style="margin-right: 5px;"></i><span>编辑</span></span>
            <span class="delete"><i class="el-icon-close" style="margin-right: 5px;"></i><span>删除</span></span>
          </section>
        </template>
      </el-table-column>
    </el-table>
  </section>
</template>
<script>
  import DrapDown from './DrapDown.vue'
  import questionOptions from './constants'
  export default {
    data() {
      return {
        loading: false,
        tableData: [{
          index: '1',
          date: '2016-05-02',
          StatusString: '王小虎',
          checkedStatus:true,
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          index: '2',
          date: '2016-05-04',
          StatusString: '王小虎',
          checkedStatus:true,
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          index: '3',
          date: '2016-05-01',
          StatusString: '王小虎',
          checkedStatus:true,
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          index: '4',
          date: '2016-05-03',
          StatusString: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }],
        enableChecked: false
      }
    },
    components: {
      DrapDown,
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
      typeCheckedStatus(v){
        this.enableChecked = !this.enableChecked
        if(!this.enableChecked){
          this.tableData.forEach(
            (v,index) =>{
              v.checkedStatus = false
            }
          )
        }
      },
      search() {
        console.log('-----', 'search')
      }
    }
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
</style>
