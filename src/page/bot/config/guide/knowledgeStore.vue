<template>
  <section :class="isSpread?'container ':['container','isSpread']" >
    <section class="padding-30">
      <title-item title="知识库"/>
      <section class="button-group"><el-input class='searchInput middle' style="width:28%" size = 'small' v-model="keyWords" placeholder="关键词搜索"><i slot="suffix" class="el-input__icon el-icon-search yoy-search-button" ></i>
      </el-input><el-button :class="total?['middle', 'margin-20', 'big-button','has-checked']:['middle', 'margin-20', 'big-button']" @click="showHasChecked">{{showTotal?'已选':'返回'}}（{{total}}/5）</el-button><el-button type="primary" @click="add">添加</el-button>
      </section>
    </section>
    <section class="hinge" @click="spread"><i class="el-icon-d-arrow-right"></i></section>
    <section class="padding-30">
      <section class="scroll-container" id="scroll-container" @scroll="handleScroll">
        <section v-for="(item, index) in tableData" :key="item.QuestionId" :class="index%2 !== 0?['even']:'odd'">
      <span class="checked-box-container">
        <el-checkbox :value="item.checked" v-model="item.checked" :disabled='item.disabled' size="medium" class="checked-box-container" @change="typeBox"></el-checkbox>
      </span>
          <section class="title">{{item.Question}}</section>
        </section>
        <section v-show='tableData.length>=10' class="loading-container primary-color" id="tableLoadingElement">
          <i v-show='!hasLoadingAllData' class="el-icon-loading"></i>
          {{hasLoadingAllData?'- 已经到底啦 -': '正在加载中...'}}
        </section>
      </section>
    </section>
  </section>
</template>
<script>
  import TitleItem from '../../../../components/Title'
  import { Loading } from 'element-ui';
  import store from './store'
  import {UPDATE, REPLACE} from "./store/mutations";
  // import ScrollTable from './ScrollTable'
  export default {
    name:'store',
    props:{

    },
    components:{
      // TitleItem,
      // ScrollTable,
    },
    computed:{
      isSpread(){
        return store.state.isSpread
      },
      details() {
        return store.state.Data.Details
      }
    },
    data(){
      return{
        total: 0,
        showTotal: true,
        getListLoading: false,
        originData:[],
        hasLoadingAllData: true,
        tableData:
          [
            {
              ID: '1',
              QuestionId: '1',
              Question: '居住证办理1',
              QuestionType: '',
              Sort: 1,
            },
            {
              ID: '2',
              QuestionId: '2',
              Question: '居住证办理2',
              QuestionType: '',
              Sort: 2,
            },
            {
              ID: '3',
              QuestionId: '3',
              Question: '居住证办理3',
              QuestionType: '',
              Sort: 3,
            },
            {
              ID: '4',
              QuestionId: '4',
              Question: '居住证办理4',
              QuestionType: '',
              Sort: 4,
            },
            {
              ID: '5',
              QuestionId: '5',
              Question: '居住证办理5',
              QuestionType: '',
              Sort: 5,
            },
            {
              ID: '6',
              QuestionId: '6',
              Question: '居住证办理6',
              QuestionType: '',
              Sort: 6,
            }
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
      spread(){
        store.dispatch(
          UPDATE,
          {isSpread: !this.isSpread}
        )
      },
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

        // this.originData = this.tableData

      },
      filterData(v){
        this.originData = this.tableData.slice(0)

        this.total = this.details.length
        const ids = this.details.map(
          (item, value) => {
            return item.QuestionId
          }
        )
        this.tableData.forEach(
          (item, index) => {
            item.checked = ids.indexOf(item.QuestionId) > -1;
            if(this.total >=5){
              item.disabled = !item.checked
            }
          }
        )
        console.log(this.tableData);

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
            this.tableData = this.originData.slice(0)
            if(this.total<5){
              this.tableData.forEach(
                (v, index) => {
                  v.disabled = false
                }
              )
            }

          }
          setTimeout(
            () =>{
              loadingInstance.close()
            }, 300
          )
        }
      },
      throttle(method, context) { //函数节流
        if(this.hasLoadingAllData){
          return;
        }
        clearTimeout(method.tId);
        method.tId= setTimeout(function(){
          method.call(context);
        }, 1000);
      },
      handleScroll(){
        if(this.getListLoading) return; //函数防抖
        this.throttle(this.get)
      },
      get(){
        this.getListLoading = true
        const scrollContainer = document.getElementById('scroll-container')
        const trueHeight = scrollContainer.scrollHeight
        const scrollTop = scrollContainer.scrollTop
        const height = trueHeight - scrollTop
        if(height < this.tableData.length*40){
          this.tableData = [...this.tableData,...this.newTableData]
          this.getListLoading = false
          console.log('到底了')
        }else{
          console.log('没到底哦')
        }
      },
      showLoading(data){
        const target = document.getElementById('item-container')
        let loadingInstance = Loading.service({
          target
        });
        store.dispatch(
          REPLACE, {loadingInstance}
        ).then(
          () => {
            setTimeout(
              () => {
                loadingInstance.close()
                store.dispatch(
                  REPLACE, {Details:data}
                )
              }, 500
            )
          }
        )
      },
      add(){
        const data = this.tableData.filter(
          (item, index) => {
            if(item.checked){
              return item
            }
          }
        )
        this.showLoading(data)
      }
    },
  }
</script>
<style lang="scss" scoped>
  @import '../../../../style/index';
  .container{
    box-sizing: border-box;
    position: absolute;
    z-index: 998;
    right: 0;
    padding:30px 0;
    top: 36px;
    height: 100%;
    max-width: 575px;
    min-height: calc( 100vh - 156px);
    border-top: 1px solid  #cecece;
    border-left: 1px solid  #cecece;
    background: #fff;
    width:35%;
    font-size: 14px;
    transition: width .3s;
    -moz-transition: width .3s; /* Firefox 4 */
    -webkit-transition: width .3s; /* Safari 和 Chrome */
    -o-transition: width .3s; /* Opera */
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
  .isSpread{
    width: 0;
    overflow: hidden;
  }
  .middle{
    vertical-align: middle;
  }
  .margin-20{
    margin-left: 20px;
  }
  @media screen and (max-width: 1370px) {
    .margin-20 {
      margin-left: 10px;
    }
    .container{
      padding: 30px;
    }

  }
  .scroll-container{
    box-sizing: border-box;
    width: 100%;
    max-height: 400px;
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
      color: $f-pri-c;
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
  .padding-30{
    padding-left: 30px;
    padding-right: 30px;
  }
  .margin-30{
    margin-left: 30px;
    margin-right: 30px;
  }

</style>
