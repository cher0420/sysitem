<template>
  <section>
    <section class="p-relative">
      <el-button type="primary" class="text-a-c createAnswer" @click="newQA">创建新问答</el-button>
      <el-input class='searchInput' size='small' placeholder="输入关键词搜索" @keyup.enter.native="search"><i slot="suffix"
                                                                                                       class="el-input__icon el-icon-search yoy-search-button"
                                                                                                       @click="search"></i>
      </el-input>
      <el-button type="primary" class="p-absolute right-0">选择</el-button>
    </section>
    <el-table
      :data="tableData"
      stripe
      border
      style="width: 100%;margin-top: 20px;">
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
        prop="StatusString"
        :render-header="renderProductId"
        min-width="40"
      >
        <template slot-scope="scope">
          <span>
            {{ scope.row.StatusString }}
          </span>
        </template>
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
  import questionOptions from './constants'

  export default {
    data() {
      return {
        loading: false,
        tableData: [{
          index: '1',
          date: '2016-05-02',
          StatusString: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          index: '2',
          date: '2016-05-04',
          StatusString: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          index: '3',
          date: '2016-05-01',
          StatusString: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          index: '4',
          date: '2016-05-03',
          StatusString: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }],
        chooseItem: false
      }
    },
    components: {
      DrapDown,
    },
    methods: {
      newQA() {
        this.$router.push({
          path:'/bot/config/createrNewQA',
          params:{
            id:111
          },
        })

      },
      renderProductId(h, {column}) {
        return h(DrapDown, {
            props: {
              options: questionOptions.status,
            },
          }
        );
      },
      search() {
        console.log('-----', 'search')
      }
    }
  }
</script>
<style scoped lang="scss">
  @import '../../../../style/index';

  .yoy-search-button {
    width: 32px !important;
    height: 30px !important;
    line-height: 30px !important;
    margin-top: 1px;
    margin-right: 1px;
    margin-bottom: 1px;
    background-color: $light-blue;
    cursor: pointer;
  }

  .el-icon-search:before {
    font-weight: 900;
    font-size: 14px;
    color: $primary-color;
  }

  .createAnswer {
    width: 100px;
    padding-left: 0;
    padding-right: 0;
    margin-right: 20px;
  }

  .searchInput {
    width: 360px;
  }

  .margin-top20 {
    margin-top: 20px;
  }
</style>
