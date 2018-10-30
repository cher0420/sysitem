<template>
  <section class="yoy-main">
    <el-select v-model="value4" clearable placeholder="请选择" class="select" @change="select">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
      <el-input class='searchInput' size = 'small' v-model="keyWords" placeholder="搜索机器人名称或描述" @keyup.enter.native="search"><i slot="suffix" class="el-input__icon el-icon-search yoy-search-button" @click="search"></i>
      </el-input>
    <el-table
      v-loading="loading"
      :data="tableData"
      row-key="id"
      border
      stripe
      class="table"
      style="width: 100%">
      <el-table-column
        prop="id"
        label="序号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="title"
        label="知识"
        width="600">
      </el-table-column>
      <el-table-column
        prop="status"
        label="友好回答">
        <template slot-scope="scope">
            <span v-for="(data,key,index) in scope.row.status" :index='index' class="handleIcon dis-i-b p-relative" @click="handleDetail(scope.row.name,key, scope.row.index)">
              <span class="p-absolute"
                    :style="{
                    background: 'url(' + require(`../../../../assets/bot/${key}.png`) + ')center center no-repeat'
                    }"></span>
              <span class='p-absolute'
                    :style="{
                    background: 'url(' + require(`../../../../assets/bot/${key}Checked.png`) + ')center center no-repeat',
                    display:data?'inline-block':'none'}"></span>
          </span>
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
  import store from '../../../../store/index'
  import {REPLACE} from "../../../../store/mutations";
  import {tableData} from './constants'

  export default {
    data() {
      return {
        options: [{
          value: 'residentialPass',
          label: '居住证'
        }, {
          value: 'socialSecurityCards',
          label: '社保卡'
        }, {
          value: 'separation',
          label: '人户分离'
        }],
        PageIndex:'1',
        total:9,
        value4: '',
        loading:false,
        tableData:tableData.all
      }
    },
    computed:{
    },
    methods:{
      search(){
        const that = this
        const description = this.keyWords
        const searchStatus = store.state.app.searchStatus
        store.dispatch(REPLACE,{PageIndex:1,description}).then(
          () =>{
            const options={
              body:{
                description,
                searchStatus,
              }
            }
            getList(URL.requestHost + BOT,options,ITEMKEY).then(
              ()=>{
                console.log('获取列表')
              }
            )
          }
        )
      },
      handleDetail(name,v,index){
        store.dispatch(REPLACE,{componentName:'questionDetail',navIndex:'knowledgeQuiz'}).then(
          () => {
            this.$route.query.botCheckIndex = v
            this.$route.query.botName = name
            this.$route.query.botIndex = index
          }
        )
      },
      handleCurrentChange(){

      },
      select(v){
        if(v){
          this.loading = true
          this.total = 3
          this.tableData = tableData[v]
        }else{
          this.loading = true
          this.tableData = tableData.all
          this.total = 9
        }
        setTimeout(
          () =>{
            this.loading = false
          },800
        )
      }
    }
  }
</script>
<style scoped lang="scss">
  .pagination{
    left: 50%;
    top: 40px;
    transform: translateX(-50%);
  }
  .select{
    margin-right: 20px;
  }
  .searchInput{
    width: 360px;
  }
  .table{
    margin-top: 20px;
  }
  .handleIconContainer{
    height: 30px;
  }
  .handleIcon{
    height: 30px;
    width: 40px;
    span{
      display: inline-block;
      width: 40px;
      height: 30px;
      cursor: pointer;
    }
  }
</style>
