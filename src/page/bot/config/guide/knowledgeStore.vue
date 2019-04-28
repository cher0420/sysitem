<template>
  <section :class="isSpread?'container ':['container','isSpread']" id="knowledgeStore">
    <section class="padding-30">
      <title-item title="知识库"/>
      <section class="button-group">
        <el-input class='searchInput middle' size = 'small' v-model="IntentName" placeholder="关键词搜索" @keyup.enter.native="search"><i slot="suffix" class="el-input__icon el-icon-search yoy-search-button" @click="search"></i>
      </el-input>
        <el-button v-model='showTotal' :class="total?['middle', 'margin-20', 'big-button','has-checked']:['middle', 'margin-20', 'big-button']" @click="showHasChecked">{{showTotal?'已选':'返回'}}（{{total}}/5）</el-button>
        <el-button class='add' type="primary" @click="add">添加</el-button>
      </section>
    </section>
    <section class="hinge" @click="spread"><i class="el-icon-d-arrow-right"></i></section>
    <section class="padding-30">
      <section class="scroll-container" id="scroll-container" @scroll="handleScroll">
        <section v-for="(item, index) in tableData" :key="index" :class="index%2 !== 0?['even']:'odd'">
          <span class="checked-box-container">
            <el-checkbox v-model="item.checked" :disabled='item.disabled' size="medium" @change="typeBox(index,item.checked,item)"></el-checkbox>
          </span>
          <el-tooltip v-if='item.FriendlyName.length>18' class="item" effect="dark" :content="item.FriendlyName" placement="bottom-start">
            <section class="title">{{item.FriendlyName}}</section>
          </el-tooltip>
          <section v-else class="title">{{item.FriendlyName}}</section>
        </section>
        <section v-show='tableData.length===0' class="f-s-14 c555 null">暂无数据</section>
        <section v-show='tableData.length>=20' class="loading-container primary-color" id="tableLoadingElement">
          <i v-show='!hasLoadingAllData || tableData.length <= 20' class="el-icon-loading"></i>
          {{hasLoadingAllData?'- 已经到底啦 -': '正在加载中...'}}
        </section>
      </section>
    </section>
  </section>
</template>
<script>
  import { Loading } from 'element-ui';
  import store from './store/index'
  import {UPDATE, APP, FILTER, DETAILS} from "./store/mutations";
  import {request} from "../../../../serive/request";
  import {TOKEN} from "../../../../constants/constants";
  import {QUERYINTENT, } from "../../../../constants/api";
  import {getCookies} from "../../../../utils/cookie";

  export default {
    name:'store',
    props:{

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
        hasLoadingAllData: false,
        IntentName: '',
      }
    },
    destroyed(){
      store.dispatch(FILTER, {total:0, tableData: [], originData: [], hasChecked: []})
      store.dispatch(UPDATE, {isSpread: false})
      store.dispatch(APP, {Data: {
        ID: '',//
          BotConfigId: '',
          GuideDescription: '',
          Channels: '',
          Details: [],
      },})
    },
    methods: {
      search(){
        if (!(/^[0-9a-zA-Z\u4e00-\u9eff]{1,}$/).test(this.IntentName)&&this.IntentName) {
          this.$message({
            type: 'error',
            message: "请不要输入特殊字符作为关键词搜索，例如 *，<，>，%，;，/，?，'，_等",
            duration: 2000,
          })
          return
        }
        this.PageIndex = 1
        this.showTotal = true
        const that = this
        const id = JSON.parse(sessionStorage.getItem('recordId'))
        const recordId = this.$route.query.recordId ? this.$route.query.recordId : id
        const url = QUERYINTENT
        const params = {
          headers:{
            'Access-Token': getCookies(TOKEN)
          },
          method: 'POST',
          body: JSON.stringify({
            BotConfigId: recordId,
            IntentName: this.IntentName,
            PageIndex: this.PageIndex,
            PageSize: 20,
          })

        }
        request(url, params).then(
          (res) => {
            //节流
            const originData = JSON.parse(JSON.stringify(res.Data))
            that.hasLoadingAllData = res.Data.length < 20;

            const details = store.state.dataAll.hasChecked?store.state.dataAll.hasChecked:[]
            //左侧列表详情
            const total = store.state.dataAll.total
            //判断列表中的questionId是否为勾选
            let template = []
            for(let v of details.values()){
              template.push(v.QuestionId)
            }

            const resArr = res.Data.filter(
              ( item, index ) => {
                item.QuestionId = item.ID
                item.Question = item.IntentName
                item.QuestionFriendlyName = item.FriendlyName
                item.checked = template.includes(item.QuestionId);
                  if(total>=5){
                    item.disabled = !item.checked
                  }else{
                    item.disabled = false
                  }
                  return item
              }
            )

            store.dispatch(
              FILTER, { tableData: resArr, originData: originData, total}
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
      typeBox(index,v, item){

        let total = store.state.dataAll.total
        v?total++:total--
        const tableData = store.state.dataAll.tableData
        let hasChecked = store.state.dataAll.hasChecked?JSON.parse(JSON.stringify(store.state.dataAll.hasChecked)):[]

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

            tableData[index].checked = v
            let arr = []
              if(v){
                hasChecked.push(item)
              }else{
                arr = hasChecked.filter(
                  (value) => {
                    if( item.ID !== value.ID){
                      return value
                    }
                  }
                )
              }
            store.dispatch(
              FILTER, {tableData: tableData,hasChecked:v?hasChecked:arr}
            )
          }
        )
      },
      filterData(v){
        const originData = v.slice(0)
        store.dispatch(FILTER, {originData})
        this.total = this.details.length

        let hasChecked = []

        for(let v of store.state.dataAll.values()){
          hasChecked.push(v.ID)
        }

        this.tableData.forEach(
          (item, index) => {
            item.checked = hasChecked.indexOf(item.QuestionId) > -1;
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
        const total = store.state.dataAll.total
        if(this.showTotal){
            if(this.total){
              this.showTotal = false

              const hasChecked = JSON.parse(JSON.stringify(store.state.dataAll.hasChecked))
              store.dispatch(FILTER, {tableData:hasChecked})

            }

          }else{
            this.showTotal = true
            const tableData = store.state.dataAll.originData.slice(0)
            const hasChecked = store.state.dataAll.hasChecked
            let arr = []
            for(let v of hasChecked) {
              arr.push(v.ID)
            }
          tableData.forEach(
            (v) => {
              v.checked = arr.includes(v.ID);
            }
          )
              tableData.forEach(
                (v, index) => {
                  if (total < 5) {
                    v.disabled = false
                  }else{
                    v.disabled = !v.checked
                  }
                }
              )
            store.dispatch(
              FILTER, {tableData}
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
        if(this.showTotal){
          this.getListLoading = true
          const scrollContainer = document.getElementById('scroll-container')
          const trueHeight = scrollContainer.scrollHeight
          const scrollTop = scrollContainer.scrollTop
          const height = trueHeight - scrollTop
          this.PageIndex++
          const that = this
          const url = QUERYINTENT
          const id = JSON.parse(sessionStorage.getItem('recordId'))
          const recordId = this.$route.query.recordId ? this.$route.query.recordId : id
          const params = {
            headers:{
              'Access-Token': getCookies(TOKEN)
            },
            method: 'POST',
            body: JSON.stringify({
              BotConfigId: recordId,
              IntentName: that.IntentName,
              PageIndex: that.PageIndex,
              PageSize: 20,
            })
          }
          request(url, params).then(
            (res) => {
              const table = store.state.dataAll.tableData?store.state.dataAll.tableData:[]
              const originData = store.state.dataAll.originData?store.state.dataAll.originData:[]
              const hasChecked = store.state.dataAll.hasChecked?store.state.dataAll.hasChecked:[]

              that.hasLoadingAllData = res.Data.length < 20;
              const total = store.state.dataAll.total

              let values = []
              for(let v of hasChecked.values()){
                values.push(v.QuestionId)
              }

              res.Data.forEach(
                (v,index) => {
                  v.QuestionId = v.ID
                  v.Question = v.IntentName
                  v.QuestionFriendlyName = v.FriendlyName
                  if(values.includes(v.QuestionId)){
                    v.checked = true
                  }
                  if (total < 5) {
                    v.disabled = false
                  }else{
                    v.disabled = !v.checked
                  }
                }
              )
              const newTable = [...table,...res.Data]
              const newOrigin = [...originData,...res.Data]

              store.dispatch(
                FILTER, { tableData:newTable, originData:newOrigin}
              ).then(
                () => {
                  that.getListLoading = false
                }
              )
            }
          )

          if(height < this.tableData.length*40){
            this.getListLoading = false
          }
        }
      },
      add(){
        const tableData = store.state.dataAll.hasChecked

        tableData.forEach(
            (v,index) => {
              if(v.IntentName){
                v.QuestionId = v.ID
                v.Question = v.IntentName
                v.QuestionFriendlyName = v.FriendlyName
              }else{
                v.IntentName = v.Question
                v.FriendlyName = v.QuestionFriendlyName
                v.ID = v.QuestionId
              }
            }
          )
          store.dispatch(
            DETAILS, { Details: tableData }
          )
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
    top: 46px;
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
      .searchInput{
        width: 50%;
      }
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
  @media screen and (max-width: 1748px) {
    .container{
      .button-group{
        .searchInput{
          width: 100%;
          margin-bottom: 15px;
        }
        .margin-20{
          margin-left: 0;
        }
      }
    }
  }
  .scroll-container{
    box-sizing: border-box;
    width: 100%;
    max-height: calc(100vh - 310px);
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
      width: 75%;
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
    height: 20px;
    line-height: 40px;
    width: 40px;
    text-align: center;
    border-right: 1px solid #edf4fc;
    vertical-align: top;
  }
  .padding-30{
    padding-left: 30px;
    padding-right: 30px;
  }
  .margin-30{
    margin-left: 30px;
    margin-right: 30px;
  }
  .has-checked{
    color: $primary-color;
    border-color: $primary-color;
  }
</style>
