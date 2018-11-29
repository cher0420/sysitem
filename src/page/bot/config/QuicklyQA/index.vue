<template>
  <section class="yoy-main">
    <section class="p-relative">
      <el-button type="primary" class="text-a-c createAnswer">创建新问答</el-button><el-input class='searchInput' size = 'small' placeholder="输入关键词搜索" @keyup.enter.native="search"><i slot="suffix" class="el-input__icon el-icon-search yoy-search-button" @click="search"></i>
      </el-input><el-button type="primary" class="p-absolute right-0">选择</el-button>
    </section>
    <el-table
      :data="tableData"
      stripe
      style="width: 100%">
      <el-table-column
        prop="index"
        label="序号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="date"
        label="日期"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址">
      </el-table-column>
    </el-table>
  </section>
</template>
<script>
  import DrapDown from './DrapDown.vue'
  export default {
    data(){
      return{
        loading:false,
        tableData: [{
          index:'1',
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          index:'2',
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          index:'3',
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          index:'4',
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }],
        chooseItem:false
      }
    },
    components:{
      DrapDown,
    },
    methods:{
      renderProductId(h, {column}) {
        return h(DrapDown,{
            props: {
              options: '',
            },
          }
        );
      },
    },
    search(){
      console.log('-----','search')
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
</style>
