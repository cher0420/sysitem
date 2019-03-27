<template>
  <section class="container">
    <section>
      <title-item title="知识库"/>
      <section class="button-group"><el-input class='searchInput middle' style="width:28%" size = 'small' v-model="keyWords" placeholder="关键词搜索"><i slot="suffix" class="el-input__icon el-icon-search yoy-search-button" ></i>
      </el-input><el-button :class="total?['middle', 'margin-20', 'big-button','has-checked']:['middle', 'margin-20', 'big-button']" @click="showHasChecked">{{showTotal?'已选':'返回'}}（{{total}}/5）</el-button><el-button type="primary">添加</el-button>
      </section>
    </section>
    <section class="hinge"><i class="el-icon-d-arrow-right"></i></section>
    <section class="scroll-container" id="scroll-container" @scroll="handleScroll">
      <section v-for="(item, index) in tableData" :key="item.id" :class="index%2 !== 0?['even']:'odd'">
      <span class="checked-box-container">
        <el-checkbox :value="item.checked" v-model="item.checked" :disabled='item.disabled' size="medium" class="checked-box-container" @change="typeBox"></el-checkbox>
      </span>
        <section class="title">{{item.name}}</section>
      </section>
      <section class="loading-container primary-color" id="tableLoadingElement">
        <i class="el-icon-loading"></i>
        正在加载中...
      </section>
    </section>
  </section>
</template>
<script>
  import TitleItem from '../../../../components/Title'
  import { Loading } from 'element-ui';
  // import ScrollTable from './ScrollTable'
  export default {
    name:'store',
    props:{

    },
    components:{
      TitleItem,
      // ScrollTable,
    },
    data(){
      return{
        total: 0,
        showTotal: true,
        getListLoading: false,
        originData:[],
        tableData: [
          {
            name: '居住证',
            checked: false,
            disabled: false
          },
          {
            name: '居住证',
            checked: false,
            disabled: false
          },
          {
            name: '居住证',
            checked: false,
            disabled: false
          },
          {
            name: '居住证',
            checked: false,
            disabled: false
          },
          {
            name: '居住证',
            checked: false,
            disabled: false
          },
          {
            name: '居住证',
            checked: false,
            disabled: false
          },
          {
            name: '居住证',
            checked: false,
            disabled: false
          },
          {
            name: '居住证',
            checked: false,
            disabled: false
          },
          {
            name: '居住证',
            checked: false,
            disabled: false
          },
          {
            name: '居住证',
            checked: false,
            disabled: false
          },
        ],
        newTableData:[
          {
            name: '居住证',
            checked: false,
            disabled: false
          },
          {
            name: '居住证',
            checked: false,
            disabled: false
          },
          {
            name: '居住证',
            checked: false,
            disabled: false
          },
          {
            name: '居住证',
            checked: false,
            disabled: false
          },
          {
            name: '居住证',
            checked: false,
            disabled: false
          },
          {
            name: '居住证',
            checked: false,
            disabled: false
          },
          {
            name: '居住证',
            checked: false,
            disabled: false
          },
        ]
      }
    },
    created(){
      this.filterData(this.tableData)
    },
    methods: {
      typeBox(v){
        v?this.total ++:this.total --;
        if(this.total >= 5){
          this.tableData.forEach(
            (item,index) =>{
              item.disabled = !item.checked
            }
          )
        } else {
          this.tableData.forEach(
            (item,index) =>{
              item.disabled = false
            }
          )
        }

        this.originData = this.tableData

      },
      filterData(v){
        this.originData = this.tableData.slice(0)
      },
      showHasChecked(){
        if(this.total){
          const element = document.getElementById('scroll-container')
          const options = {
            target:element
          }
          let loadingInstance = Loading.service(options);

          if(this.showTotal){
            this.showTotal = false
            this.tableData = this.tableData.filter(
              (item,index) =>{
                return item.checked;
              }
            )
          }else{
            this.showTotal = true
            this.tableData = this.originData
          }
          setTimeout(
            () =>{
              loadingInstance.close()
            }, 300
          )
        }
      },
      throttle(method, context) { //函数节流
        clearTimeout(method.tId);
        method.tId= setTimeout(function(){
          method.call(context);
        }, 1000);
      },
      handleScroll(){
        // if(this.getListLoading) return; //函数防抖
        this.throttle(this.get)
      },
      get(){
        const scrollContainer = document.getElementById('scroll-container')
        const trueHeight = scrollContainer.scrollHeight
        const scrollTop = scrollContainer.scrollTop
        const height = trueHeight - scrollTop
        if(height < this.tableData.length*40){
          this.tableData = [...this.tableData,...this.newTableData]
          console.log('到底了')
        }else{
          console.log('没到底哦')
        }
        this.getListLoading = true
      }
    },
  }
</script>
<style lang="scss" scoped>
  @import '../../../../style/index';
  .container{
    position: absolute;
    padding:30px 40px;
    z-index: 998;
    right: 0;
    top: -31px;
    width: 32%;
    mix-width: 575px;
    min-width: 330px;
    height: calc( 100vh - 156px);
    box-sizing: border-box;
    border-top: 1px solid  #cecece;
    border-left: 1px solid  #cecece;
    .button-group{
      padding-top: 30px;
      padding-bottom: 20px;
    }
    .hinge{
      position: absolute;
      top: 50%;
      margin-top: -20px;
      left: 0;
      height: 40px;
      line-height: 40px;
      text-align: center;
      width: 19px;
      border-radius: 0 4px 4px 0;
      border-top: 1px solid #cecece;
      border-right: 1px solid #cecece;
      border-bottom: 1px solid #cecece;
      i{
        color: #cecece
      }
    }
    .hinge:hover{
      cursor: pointer;
      i{
        transform: translateX(2px);
        transition: transform .2s;

      }
    }
  }
  .container:hover{

  }
  .middle{
    vertical-align: middle;
  }
  .margin-20{
    margin-left: 20px;
  }
  .scroll-container{
    width: 100%;
    height: 400px;
    border: 1px solid $border-color;
    overflow: scroll;
    .even{
      background: #f9fafc;
    }
    section{
      height: 40px;
      line-height: 40px;
    }
    .title{
      display: inline-block;
      padding-left: 18px;
      width: 60%;
      height: 40px;
      line-height: 40px;
      overflow-x: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
      vertical-align: top;
    }
    .loading-container{
      width: 100%;
      height: 40px;
      line-height: 40px;
      text-align: center;
    }
  }
  .checked-box-container{
    display: inline-block;
    height: 40px;
    line-height: 40px;
    width: 40px;
    text-align: center;
    border-right: 1px solid #edf4fc;
    vertical-align: top;
  }
  .has-checked{
    color: $primary-color;
    border-color: $primary-color;
  }
</style>
