<template>
  <section :class="isSpread?'container ':['container','isSpread']" >
    <section class="padding-30">
      <title-item title="知识库"/>
      <section class="button-group"><el-input class='searchInput middle' style="width:28%" size = 'small' v-model="IntentName" placeholder="关键词搜索" @keyup.enter.native="search"><i slot="suffix" class="el-input__icon el-icon-search yoy-search-button" @click="search"></i>
      </el-input><el-button v-model='showTotal' :class="total?['middle', 'margin-20', 'big-button','has-checked']:['middle', 'margin-20', 'big-button']" @click="showHasChecked">{{showTotal?'已选':'返回'}}（{{total}}/5）</el-button><el-button type="primary" @click="add">添加</el-button>
      </section>
    </section>
    <section class="hinge" @click="spread"><i class="el-icon-d-arrow-right"></i></section>
    <section class="padding-30">
      <section class="scroll-container" id="scroll-container" @scroll="handleScroll">
        <section v-for="(item, index) in tableData" :key="index" :class="index%2 !== 0?['even']:'odd'">
          <span class="checked-box-container">
            <el-checkbox v-model="item.checked" :disabled='item.disabled' size="medium" class="checked-box-container" @change="typeBox(index,item.checked)"></el-checkbox>
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
  import {UPDATE, APP, FILTER, DETAILS} from "./store/mutations";
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
    // created(){
    //   this.getIntentName()
    // },
    destroyed(){
      store.dispatch(FILTER, {total:0, tableData: [], originData: []})
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
        this.PageIndex = 1
        this.showTotal = true
        const that = this
        const id = JSON.parse(sessionStorage.getItem('recordId'))
        const recordId = this.$route.query.recordId ? this.$route.query.recordId : id
        const url = '/api/admin/portal/guideQuestion/queryIntent'
        const params = {
          headers:{
            'Access-Token': getCookies(TOKEN)
          },
          method: 'POST',
          body: JSON.stringify({
            BotConfigId: recordId,
            IntentName: this.IntentName,
            PageIndex: this.PageIndex,
            PageSize: 10,
          })

        }
        request(url, params).then(
          (res) => {
            const details = store.state.app.Data.Details?store.state.app.Data.Details:[]
            const total = details.length

            let template = []
            for(let v of details.values()){
              template.push(v.QuestionId)
            }
            if(!that.IntentName){
              let templateArr = []
              for(let v of res.Data.values()){
                templateArr.push(v.QuestionId)
              }
              details.forEach(
                (v,index) => {
                  if(!templateArr.includes(v.QuestionId)){
                    v.ID = v.QuestionId
                    v.IntentName = v.Question
                    v.checked = true
                    res.Data.unshift(v)
                  }
                }
              )
            }

            const resArr = res.Data.filter(
              ( item, index ) => {
                item.QuestionId = item.ID
                item.Question = item.IntentName
                item.checked = template.includes(item.QuestionId);
                // if(that.showTotal){
                  if(total>=5){
                    item.disabled = !item.checked
                  }else{
                    item.disabled = false
                  }
                  return item
              }
            )


            if(res.Data.length<10){
              that.hasLoadingAllData = true
            }else{
              that.hasLoadingAllData = false
            }

            const templateData = store.state.dataAll.originData
            let values = []
            for(let v of templateData.values()){
              values.push(v.QuestionId)
            }
            const newArr = res.Data.filter(
              (v,index) => {
                if(!values.includes(v.QuestionId)){
                  return v
                }
              }
            )
            let  originData = [...templateData,...newArr]

            store.dispatch(
              FILTER, { tableData: resArr, originData: originData, total}
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
      // getIntentName(){
      //   const that = this
      //    const id = JSON.parse(sessionStorage.getItem('recordId'))
      //    const recordId = this.$route.query.recordId ? this.$route.query.recordId : id
      //   const url = '/api/admin/portal/guideQuestion/queryIntent'
      //   const params = {
      //     headers:{
      //       'Access-Token': getCookies(TOKEN)
      //     },
      //     method: 'POST',
      //     body: JSON.stringify({
      //       BotConfigId: recordId,
      //       IntentName: this.IntentName,
      //       PageIndex: this.PageIndex,
      //       PageSize: 10,
      //     })
      //
      //   }
      //   request(url, params).then(
      //     (res) => {
      //       const details = store.state.app.Data.Details
      //       const total = details.length
      //
      //       let template = []
      //       for(let v of details.values()){
      //         template.push(v.QuestionId)
      //       }
      //       res.Data.forEach(
      //         ( item, index ) => {
      //           item.QuestionId = item.ID
      //           item.Question = item.IntentName
      //           item.checked = template.includes(item.QuestionId);
      //
      //           if(total>=5){
      //             item.disabled = !item.checked
      //           }else{
      //             item.disabled = false
      //           }
      //
      //         }
      //       )
      //       if(res.Data.length<10){
      //         that.hasLoadingAllData = true
      //       }else{
      //         that.hasLoadingAllData = false
      //       }
      //
      //       store.dispatch(
      //         FILTER, { tableData: res.Data, originData: res.Data, total}
      //       )
      //     }
      //   ).catch(
      //     () => {
      //       that.$message(
      //         {
      //           type:'error',
      //           message: '意图列表获取失败，请稍后重试',
      //           duration: 2000
      //         }
      //       )
      //     }
      //   )
      // },
      spread(){
        store.dispatch(
          UPDATE,
          {isSpread: !this.isSpread}
        )
      },
      typeBox(index,v){

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

            tableData[index].checked = v
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
        const total = store.state.dataAll.total

        if(this.showTotal){
          this.hasLoadingAllData = true
            if(this.total){
              this.showTotal = false
              const details = store.state.app.Data.Details

              const templateData = store.state.dataAll.originData

              const tableData = templateData.filter(
                (item,index) =>{
                  if(item.checked)
                    return item;
                }
              )

              store.dispatch(FILTER, {tableData})
            }

          }else{
            this.hasLoadingAllData = false
            this.showTotal = true
            const tableData = store.state.dataAll.originData.slice(0)

            if(total<5){
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
            PageSize: 10,
          })
        }
        request(url, params).then(
          (res) => {

            that.hasLoadingAllData = res.Data.length < 10;
            const total = store.state.dataAll.total

              res.Data.forEach(
                (v,index) => {
                  v.QuestionId = v.ID
                  v.Question = v.IntentName
                  if(total>=5){
                    v.disabled = true
                  }
                }
              )


            const table = store.state.dataAll.tableData
            const originData = store.state.dataAll.originData

            let values = []
            for(let v of table.values()){
              values.push(v.QuestionId)
            }
            const someData = res.Data.filter(
              (v,index) => {
                if(!values.includes(v.QuestionId)){
                  return v
                }
              }
            )
            const newTable = [...table,...someData]
            const newOrigin = [...originData,...someData]

            store.dispatch(
              FILTER, { tableData:newTable, originData:newOrigin}
            ).then(
              () => {
                that.getListLoading = false
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
                )
      },
      add(){
        const details = store.state.app.Data.Details
        const tableData = store.state.dataAll.tableData

        // details.forEach(
        //   (item,index) => {
        //     item.checked = true
        //     item.IntentName = item.Question
        //   }
        // )

        let templateTableData = tableData.filter(
          (item,index) =>{
            if(item.checked)
              return item;
          }
        )

        // let arr = []
        // for(let v of details.values()) {
        //   arr.push(v.QuestionId)
        // }
        // const someData = templateTableData.filter(
        //   (v,index) => {
        //     if(!arr.includes(v.QuestionId)){
        //       return v
        //     }
        //   }
        // )
        // templateTableData = [...someData, ...details]
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
