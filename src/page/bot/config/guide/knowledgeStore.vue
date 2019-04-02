<template>
  <section :class="isSpread?'container ':['container','isSpread']" >
    <section class="padding-30">
      <title-item title="知识库"/>
      <section class="button-group"><el-input class='searchInput middle' style="width:28%" size = 'small' v-model="IntentName" placeholder="关键词搜索" @keyup.enter.native="search"><i slot="suffix" class="el-input__icon el-icon-search yoy-search-button" @click="search"></i>
      </el-input><el-button :class="total?['middle', 'margin-20', 'big-button','has-checked']:['middle', 'margin-20', 'big-button']" @click="showHasChecked">{{showTotal?'已选':'返回'}}（{{total}}/5）</el-button><el-button type="primary" @click="add">添加</el-button>
      </section>
    </section>
    <section class="hinge" @click="spread"><i class="el-icon-d-arrow-right"></i></section>
    <section class="padding-30">
      <section class="scroll-container" id="scroll-container" @scroll="handleScroll">
        <section v-for="(item, index) in tableData" :key="item.ID" :class="index%2 !== 0?['even']:'odd'">
          <span class="checked-box-container">
            <el-checkbox v-model="item.checked" :disabled='item.disabled' size="medium" class="checked-box-container" @change="typeBox"></el-checkbox>
          </span>
          <!--<el-tooltip class="item" effect="dark" :content="item.IntentName" placement="top-start">-->
            <section class="title">{{item.IntentName}}</section>
          <!--</el-tooltip>-->
        </section>
        <section v-show='tableData.length===0' class="f-s-14 c555 null">暂无数据</section>
        <section v-show='tableData.length>=10' class="loading-container primary-color" id="tableLoadingElement">
          <i v-show='!hasLoadingAllData' class="el-icon-loading"></i>
          {{hasLoadingAllData?'- 已经到底啦 -': '正在加载中...'}}
        </section>
      </section>
    </section>
  </section>
</template>
<script>
  import { Loading } from 'element-ui';
  import store from './store/index'
  import {UPDATE, REPLACE, FILTER, DETAILS} from "./store/mutations";
  import {request} from "../../../../serive/request";
  import {TOKEN} from "../../../../constants/constants";
  import {getCookies} from "../../../../utils/cookie";

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
      total(){
        return store.state.dataAll.total
      },
      tableData() {
        return store.state.dataAll.tableData
      },
      originData() {
        return store.state.dataAll.originData
      },
    },
    data(){
      return{
        PageIndex:1,
        showTotal: true,
        getListLoading: false,
        hasLoadingAllData: true,
        IntentName: '',
      }
    },
    created(){
      this.getIntentName()

    },
    methods: {
      search(){
        this.PageIndex = 1
        this.getIntentName()
      },
       getIntentName(){
        const that = this
        const url = '/api/admin/portal/guideQuestion/queryIntent'
        const params = {
          headers:{
            'Access-Token': getCookies(TOKEN)
          },
          method: 'POST',
          body: JSON.stringify({
            BotConfigId: this.$route.query.recordId,
            IntentName: this.IntentName,
            PageIndex: this.PageIndex,
            PageSize: 10,
          })

        }
        request(url, params).then(
          (res) => {
            res.Data.forEach(
              ( item, index ) => {
                item.QuestionId = item.ID
                item.Question = item.IntentName
              }
            )
            if(res.Data.length<10){
              that.hasLoadingAllData = true
            }else{
              that.hasLoadingAllData = false
            }
            store.dispatch(
              FILTER, { tableData: res.Data, originData: res.Data}
            )
          }
        ).catch(
          () => {
            that.$message(
              {
                type:'error',
                message: '意图列表获取失败，请稍后重试',
                duration: 2000
              }
            )
          }
        )
      },
      spread(){
        store.dispatch(
          UPDATE,
          {isSpread: !this.isSpread}
        )
      },
      typeBox(v){
        let total = store.state.dataAll.total
        const tableData = store.state.dataAll.tableData
        const totalNew = v? total ++:total --;

        store.dispatch(FILTER,{total}).then(
          () => {
            if(total >= 5){
              tableData.forEach(
                (item,index) =>{
                  item.disabled = !item.checked
                }
              )
            } else {
              tableData.forEach(
                (item,index) =>{
                  item.disabled = false
                }
              )
            }
            store.dispatch(
              FILTER, {tableData: tableData}
            )
          }
        )
      },
      filterData(v){
        const originData = v.slice(0)
        store.dispatch(FILTER, {originData})
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
        store.dispatch(
          FILTER, {tableData: this.tableData}
        )
      },
      showHasChecked(){
        // if(this.total){
          // const element = document.getElementById('scroll-container')
          // const options = {
          //   target:element
          // }
          // let loadingInstance = Loading.service(options);
          if(this.showTotal){
            if(this.total){
              this.showTotal = false
              const details = store.state.app.Data.Details
              details.forEach(
                (item,index) => {
                  item.checked = true
                  item.IntentName = item.Question
                }
              )
              const templateTableData = [...this.tableData, ...details]

              const tableData = templateTableData.filter(
                (item,index) =>{
                  if(item.checked)
                    return item;
                }
              )
              store.dispatch(FILTER, {tableData})
            }

          }else{
            this.showTotal = true
            const tableData = this.originData.slice(0)
            if(this.total<5){
              tableData.forEach(
                (v, index) => {
                  v.disabled = false
                }
              )
            }
            store.dispatch(
              FILTER, {tableData}
            )

          }
          // setTimeout(
          //   () =>{
          //     // loadingInstance.close()
          //   }, 300
          // )
        // }
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
        this.PageIndex++
        const that = this
        const url = '/api/admin/portal/guideQuestion/queryIntent'
        const params = {
          headers:{
            'Access-Token': getCookies(TOKEN)
          },
          method: 'POST',
          body: JSON.stringify({
            BotConfigId: that.$route.query.recordId,
            IntentName: that.IntentName,
            PageIndex: that.PageIndex,
            PageSize: 10,
          })
        }
        request(url, params).then(
          (res) => {
            if(res.Data.length<10){
              that.hasLoadingAllData = true
            }else{
              that.hasLoadingAllData = false
            }
            const originData = store.state.dataAll.originData
            const tableData = store.state.dataAll.tableData

            store.dispatch(
              FILTER, { tableData:[...tableData,...res.Data], originData:[...originData,...res.Data]}
            ).then(
              () => {

              }
            )
          }
        ).catch(
          () => {
            that.$message(
              {
                type:'error',
                message: '意图列表获取失败，请稍后重试',
                duration: 2000
              }
            )
          }
        )

        if(height < this.tableData.length*40){
          this.getListLoading = false
          console.log('到底了')
        }else{
          console.log('没到底哦')
        }
      },
      showLoading(data){

        data.forEach(
          (v,index) => {
            if(v.IntentName){
              v.QuestionId = v.ID
              v.Question = v.IntentName
            }else{
              v.IntentName = v.Question
              v.ID = v.QuestionId
            }
          }
        )

                store.dispatch(
                  DETAILS, { Details: data }
                ).then(
                  () => {
                    console.log(store.state.app.Data.Details)
                  }
                )
      },
      add(){
        const details = store.state.app.Data.Details

        details.forEach(
          (item,index) => {
            item.checked = true
            item.IntentName = item.Question
          }
        )

        let templateTableData = this.tableData.filter(
          (item,index) =>{
            if(item.checked)
              return item;
          }
        )
        let arr = []
        for(let v of details.values()) {
          arr.push(v.QuestionId)
        }
        const someData = templateTableData.filter(
          (v,index) => {
            if(!arr.includes(v.QuestionId)){
              return v
            }
          }
        )
        templateTableData = [...someData, ...details]
        this.showLoading(templateTableData)
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
    .null{
      display: inline-block;
      width: 100%;
      height: 47px;
      line-height: 47px;
      text-align: center;
      color: #909399;
    }
    /*.item{*/
      /*width: 300px;*/
    /*}*/
    .title{
      display: inline-block;
      padding-left: 18px;
      width: 80%;
      height: 40px;
      line-height: 40px;
      overflow-x: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
      vertical-align: top;
      color: $f-pri-c;
      cursor: default;
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
