<template>
  <section class="item-container" id="item-container" v-if="Details.length>0">
    <draggable
      :group="{ name: 'people',  put: false }"
      ghost-class="ghost"
      animation="300"
      scrollSpeed="20"
      :sortable="false"
      @change="logs"
      @onMove="logs"
    >
      <transition-group>
        <div v-for="(item, index) in Details" :key="index" class="item">
          <span class="question">{{item.Question}}</span>
          <span class="del" @click="handleDel(index, item.QuestionId)">
            <i class="el-icon-close"></i>
            <span class="text">删除</span>
          </span>
        </div>
      </transition-group>
    </draggable>
  </section>
</template>
<script>
  import store from './store'
  import draggable from 'vuedraggable'
  import {Loading} from 'element-ui'
  import {REPLACE, FILTER} from "./store/mutations";

  export default {
    name: 'TapItem',
    data(){
      return{
        DetailsIndex:[]
      }
    },
    components: {
      draggable,
    },
    computed:{
      Details(){
        return store.state.Data.Details
      },
      tableDatd(){
        return store.state.tableData
      }
    },
    created(){
    },
    methods:{
      logs(v){
        console.log(this.Details)
      },
      handleDel(v, id){
        this.Details.splice(v,1)
        store.dispatch(
          REPLACE,
          { Details:this.Details }
        )
        const tableData = store.state.dataAll.tableData

        for (let v of tableData){
          if(v.QuestionId === id){
            v.checked = false
            break;
          }
        }

        store.commit(
          FILTER, {tableData,total: this.Details.length}
        )
      },
      showLoading(){
        const target = document.getElementById('item-container')
        let loadingInstance = Loading.service({
          target
        });
        store.dispatch(
          REPLACE, {loadingInstance}
        )
      }
    }
  }
</script>
<style scoped lang="scss">
  @import "../../../../style/index";
  .item-container{
    max-width: 1000px;
    width: 60%;
    border: 1px solid $border-color;
    margin-bottom: 20px;
    margin-left: 40px;
  }
  .item{
    box-sizing: border-box;
    height: 48px;
    font-size: 14px;
    line-height: 48px;
    padding: 0 27px;
    color: $f-pri-c;
    border: 1px solid #fff;
    .question{
      display: inline-block;
      float: left;
    }
    .del{
      .el-icon-close{
        font-weight: 600;
      }
      display: none;
      float: right;
      color: $danger;
      .text:hover {
        text-decoration: underline;
      }
    }
    .del:hover{
      cursor: pointer;
    }
  }
  .item:hover{
    .del{
      display: inline-block;
    }
    background-color: #f9fafc;
    cursor: move;
    border-color: $primary-color;
  }
  .ghost{
    border-bottom-color: $primary-color;
  }
  .handle{
    background: teal;
  }
</style>
