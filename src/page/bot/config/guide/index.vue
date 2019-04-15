<template>
  <div v-loading="loading"  class="p-relative">
    <section class="pop" v-show='!change'>
      <div class="location">
        <div class="guide">
          通过设置引导问题，用户可自定义机器人展示问候语时附加“引导问题”，回复形式为：问候语+引导语+引导问题 <br>
          - 问候语设置：可在“渠道配置”中进行自定义设置 <br>
          - 引导语设置：自定义引导语，设置完成后出现形式如下图<br>
          - 引导问题设置：选择添加右侧知识库中的知识，设置完成后出现形式如下图
        </div>
        <section class="way">
          <div style="margin-right:60px">
            <img src="../../../../assets/guide/weChat.png" alt="">
            <p class="center">微信端</p>
          </div>
          <p class="guide text">您好，请问有什么能帮助您?<br><br>
            您可以尝试这样问我： <br><br>
            引导问题1<br>
            引导问题2<br>
            引导问题3<br>
            ...</p>
          <div style="margin-left:60px">
            <img src="../../../../assets/guide/webChat.png" alt="">
            <p class="center">网页端</p>
          </div>
        </section>
        <div style="text-align:center;"><el-button  class="open" @click="hide">我知道了</el-button></div>
      </div>
    </section>
    <section class="startIt">
    </section>
    <section class="title">
      <nav-title title="引导问题">
        <span @click="why" class="state"><i class="el-icon-question"></i>什么是引导问题？</span>
        <el-button class="on" v-show='!changeIt' @click="start">开启</el-button>
        <span class="stopBtn" v-show='!stopIt' >
              <el-button class="off"  @click="stop">停用</el-button>
              <el-button class="on"  @click="clearAll" :disabled="disable||!textTotal && details.length === 0&&checkList.length===0">清空数据</el-button>
          </span>
      </nav-title>
    </section>
    <section class="config">引导语设置</section>
    <div class="area">
        <textarea class="c555" :disabled="!disabled"
                  v-model="Guidetext" rows="8" type="text"
                  @input="getTextTotal" maxlength="50"
                  placeholder="例如：你可以这样问我" ></textarea>
      <span>{{textTotal}}/50字</span>
    </div>
    <section class="config">选择引导问题（最多5个）</section>
    <tap-item></tap-item>
    <el-button class="open" :disabled="!disabled || isSpread" @click="openKnowLedgeStore">打开知识库</el-button>
    <section class="config">选择渠道</section>
    <div class="checkbox">
      <template  class="checkbox">
        <div class="check" v-show="!over"></div>
        <el-checkbox-group v-model="checkList">
          <el-checkbox class='checkbox' label="webchat" >网页</el-checkbox><br>
          <el-checkbox class='checkbox' label="wechat" >微信</el-checkbox>
        </el-checkbox-group>
      </template>
      <p class="tip"> <i class="el-icon-warning"> </i>默认引导语与引导问题问候语一同出现</p>
    </div>
    <el-button class="open save" :disabled="!disabled || !textTotal || details.length === 0||checkList.length===0" @click="save">保存 </el-button>
    <knowledge-store ref="knowledge"/>
  </div>

</template>
<script>
  import KnowledgeStore from './knowledgeStore'
  import TapItem from './TapItem'
  import store from './store'
  import NavTitle from '../../../../components/NavTitle'
  import {UPDATE, FILTER, DETAILS,APP,RESTART} from "./store/mutations";
  import { GETSERVICE ,UPDATESERVICE,CHECKQUERY,UPDATEQUESTION,DELETEALL,ADDQUESTION} from "../../../../constants/api.js";
  import { mapGetters, mapActions } from "vuex";
  import { request } from "../../../../serive/request";
  import { getCookies } from "../../../../utils/cookie";
  import {TOKEN} from '../../../../constants/constants.js'

  export default {
    data() {
      return {
        change:true,
        over:true,
        changeIt:false,
        stopIt:true,
        Guidetext:'',
        textTotal:0,
        checkList: ['wechat','webchat'],
        clearBtn:false,
        loading:true
      }
    },
    computed:{
      details(){

        return store.state.app.Data.Details
      },
      isSpread(){
        return store.state.isSpread
      }
    },
    created() {
      this.checkData()
    },
    components:{
      KnowledgeStore,
      TapItem,
      NavTitle
    },
    destroyed(){

    },
    methods: {
      init() {
        this.tableData = []
        this.total = 0


      },
      why(){
        this.change=false
      },
      hide(){
        this.change=true
      },
      start(){
        const ID = store.state.app.Data.serviceId
        const id = JSON.parse(sessionStorage.getItem('recordId'))
        const BotConfigId = this.$route.query.recordId?this.$route.query.recordId:id
        const Enable = true
        const params = {
          headers:{
            'Access-token': getCookies(TOKEN)
          },
          method: 'POST',
          body: JSON.stringify({
            BotConfigId,ID,Enable
          })
        }
        request(UPDATESERVICE, params).then(res => {
          //修改enable状态 为true
          store.dispatch(DETAILS,{Enable:res.Data})
        });
        this.disabled =true
        this.changeIt=true
        this.stopIt=false
        this.over=true  // check可以点击
      },
      stop(){
        store.dispatch(UPDATE, {isSpread: false})
        const ID = store.state.app.Data.serviceId
        const id = JSON.parse(sessionStorage.getItem('recordId'))
        const BotConfigId = this.$route.query.recordId?this.$route.query.recordId:id
        const Enable = false
        const params = {
          headers:{
            'Access-token': getCookies(TOKEN)
          },
          method: 'POST',
          body: JSON.stringify({
            BotConfigId,ID,Enable
          })
        }
        request(UPDATESERVICE, params).then(res => {
          store.dispatch(DETAILS,{Enable:false})
        });
        this.disabled =false
        this.changeIt=false
        this.stopIt=true
        this.over=false
      },
      checkData(){
        const id = JSON.parse(sessionStorage.getItem('recordId'))
        const BotConfigId = this.$route.query.recordId?this.$route.query.recordId:id
        const params = {
          headers:{
            'Access-token': getCookies(TOKEN)
          },
          method: 'POST',
          body: JSON.stringify({
            BotConfigId
          })
        }

        request(CHECKQUERY, params).then(res => {
          const Guidetext=res.Data&&res.Data.GuideDescription
          this.Guidetext=Guidetext
          const checkList=res.Data?res.Data.Channels.split("|"):[]
          this.checkList=checkList
          this.getTextTotal()
          this.checkService()
          if (!res.Data) {
            this.loading=false
            this.clearBtn=false
            request(GETSERVICE, params).then(res => {
              const ID = res.Data.ID
              store.dispatch(DETAILS,{Enable:res.Data.Enable})
              if (res.Data.Enable) {
                this.change =true
              } else {
                this.change = false
              }
              store.dispatch(DETAILS,{serviceId:ID,Enable:res.Data.Enable})
            })

          } else {
            store.dispatch(APP,{Data:res.Data})
            this.disabled =true  //保存不可点  enable为true
            this.changeIt=true  //开启按钮隐藏
            this.loading=false
            this.clearBtn=true
          }

        });
      },
      checkService(){
        const id = JSON.parse(sessionStorage.getItem('recordId'))
        const BotConfigId = this.$route.query.recordId?this.$route.query.recordId:id
        const params = {
          headers:{
            'Access-token': getCookies(TOKEN)
          },
          method: 'POST',
          body: JSON.stringify({
            BotConfigId
          })
        }
        request(GETSERVICE, params).then(res => {
          const ID = res.Data.ID
          store.dispatch(DETAILS,{Enable:res.Data.Enable}).then(
            () =>{
              console.log(store.state.app.Data.Enable)
            }
          )

          if (res.Data.Enable) {
            this.change =true
            this.stopIt=false   //停用和清空按钮
            this.changeIt=true
            this.disabled =true
            this.over=true
          } else {
            this.change = false
            this.stopIt=true   //停用和清空按钮显示
            this.changeIt=false  //开启按钮隐藏
            this.disabled =false
            this.over=false  // check可以点击


          }
          store.dispatch(DETAILS,{serviceId:ID,Enable:res.Data.Enable})
        })

      },
      clearAll(){
        const ID = store.state.app.Data.ID
        store.dispatch(DETAILS,{GuideDescription:this.Guidetext,Channels:this.checkList})
        this.$confirm('确定清空以上信息?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(
          () => {
            if (!store.state.app.Data.ID) {
              this.clearBtn=false
              store.dispatch(RESTART,{Data:null}).then(
                () =>{
                  this.checkList=store.state.app.Data.Channels||[]
                  this.Guidetext=store.state.app.Data&&store.state.app.Data.GuideDescription||''
                  this.getTextTotal()
                })
            } else {

              const params = {
                headers:{
                  'Access-token': getCookies(TOKEN)
                },
                method: 'POST',
                body: JSON.stringify({
                  ID
                })

              }
              request(DELETEALL, params).then(res => {
                store.dispatch(RESTART,{Data:null}).then(
                  () =>{
                    console.log(store.state.app.Data)
                    this.checkList=store.state.app.Data.Channels
                    this.Guidetext=store.state.app.Data&&store.state.app.Data.GuideDescription||''
                    const dataAll = store.state.dataAll
                    const tableData = dataAll.tableData.map(
                      (v, index) => {
                        v.checked = false
                        v.disabled = false
                        return v
                      }
                    )
                    store.dispatch(
                      FILTER, {tableData,originData: tableData,total: 0}
                    )
                  }
                )
              });
              this.clearBtn=false
              this.textTotal=0
            }
            let tableData = store.state.dataAll.tableData
            let originData = store.state.dataAll.originData
            tableData.forEach(
              (v) => {
                v.checked = false
              }
            )
            originData.forEach(
              (v) => {
                v.checked = false
              }
            )
            store.dispatch(
              FILTER,{tableData,originData,hasChecked: [],total:0}
            )
          })
      },
      getTextTotal(){
        if (this.Guidetext!=null) {
          this.textTotal =this.Guidetext.length;
        }
      },
      save(){
        const ID = store.state.app.Data.ID
        if (!ID ) {
          console.log('add', '')
          this.addQuestion()
        } else {
          console.log('update', '')
          this.updateQuestion();
        }
        store.dispatch(DETAILS,{GuideDescription:this.Guidetext})

      },
      addQuestion(){
        const that = this
        this.$confirm('确定保存以上信息?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(
          () => {
            const id = JSON.parse(sessionStorage.getItem('recordId'))
            const BotConfigId = this.$route.query.recordId?this.$route.query.recordId:id
            const GuideDescription= that.Guidetext.replace(/^(\s|\u00A0)+/,'').replace(/(\s|\u00A0)+$/,'')
            const Channels = this.checkList

            let QuestionDetails = JSON.parse(JSON.stringify(store.state.app.Data.Details))

            QuestionDetails.forEach(
              (v,index) => {
                v.Sort = index
                delete v.disabled
                delete v.checked
              }
            )
            const params = {
              headers:{
                'Access-token': getCookies(TOKEN)
              },
              method: 'POST',
              body: JSON.stringify({
                BotConfigId,GuideDescription,QuestionDetails,Channels
              })
            }
            request(ADDQUESTION, params).then(res => {
              console.log(res.Data)

              store.dispatch(DETAILS,{ID:res.Data})

              that.clearBtn=true
              that.$message(
                {
                  type: 'success',
                  message: '添加成功',
                  duration: 2000
                }
              )
            })
          }
        ).catch(
          () => {
            that.$message(
              {
                type: 'success',
                message: '已取消保存'
              }
            )
          }
        )


      },
      updateQuestion(){
        const that = this
        this.$confirm('确定保存以上信息?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(
          () => {
            const  ID = store.state.app.Data.ID
            const id = JSON.parse(sessionStorage.getItem('recordId'))
            const BotConfigId = that.$route.query.recordId?that.$route.query.recordId:id
            const GuideDescription= that.Guidetext.replace(/^(\s|\u00A0)+/,'').replace(/(\s|\u00A0)+$/,'')
            let Channels=that.checkList

            let QuestionDetails = JSON.parse(JSON.stringify(store.state.app.Data.Details))

            QuestionDetails.forEach(
              (v,index) => {
                v.Sort = index
                delete v.disabled
                delete v.checked
              }
            )
            const params = {
              headers:{
                'Access-token': getCookies(TOKEN)
              },
              method: 'POST',
              body: JSON.stringify({
                BotConfigId,GuideDescription,Channels,QuestionDetails,ID
              })
            }
            request(UPDATEQUESTION, params).then(res => {
              console.log(store.state.app.Data.Details)
              that.$message(
                {
                  type: 'success',
                  message: '保存成功',
                  duration: 2000
                }
              )

            })
          }
        ).catch(
          () => {
            that.$message(
              {
                type: 'info',
                message: '已取消保存',
                duration: 2000
              }
            )
          }
        )

      },
      getIntentName(){
        store.dispatch( FILTER, {total: 0} ).then(
          () => {
            store.dispatch( UPDATE, {isSpread: true} )
          }
        )
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
            IntentName: '',
            PageIndex: 1,
            PageSize: 10,
          })
        }
        request(url, params).then(
          (res) => {
            const details = store.state.app.Data.Details?store.state.app.Data.Details:[]
            store.dispatch( FILTER, {total: details.length} )
            const tableData = res.Data
            let template = []

            for(let v of details.values()){
              template.push(v.QuestionId)
            }
            tableData.forEach(
              (item, index, arr) => {
                item.QuestionId = item.ID
                item.Question = item.IntentName
                delete item.Sort
                item.checked = template.includes(item.QuestionId);
                if (details.length >= 5) {
                  item.disabled = !item.checked
                }
              }
            )

            const hasChecked = store.state.app.Data.Details&&store.state.app.Data.Details.filter(
              (v) => {
                v.checked = true
                v.ID = v.QuestionId
                v.IntentName = v.Question
                delete v.Sort
                return v
              }
            )
            store.dispatch( FILTER, {tableData, originData:  tableData, hasChecked} )
          }
        )
      },
      openKnowLedgeStore(){
        this.getIntentName()
      }
    }
  }
</script>
<style scoped lang="scss">
  @import "../../../../style/index.scss";
  .state{ cursor:pointer;}
  .pop{
    position: absolute;
    left: 0;
    top: -50px;
    height: calc(100% + 105px);
    background: rgba($color: #000000, $alpha: .5);  width:100%;z-index:999;
    .location{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
      .guide{background:#eaedf1;border-radius: 10px;display: inline-block;padding:30px;width:100%;box-sizing:border-box;}
      .way{margin-top:40px;margin-bottom:-40px;display: flex;box-sizing:border-box;
        .text{height: 260px;width:220px;}
        img{height: 80%;}
      }
      .center{text-align: center;color: #fff}
    }
  }
  .startIt{width:3000px;height: 300px;background:rgba($color: #928e8e, $alpha: .5);position:fixed;z-index: 99;display: none;}
  .line{
    display: inline-block;
    width: 2px;
    height: 24px;
    background-color: #2a8ce7;
    margin-right: 6px;}
  .title{color: #555;font-size: 24px;  font-family: "Microsoft YaHei";
    span{font-size: 12px;color:#2a8ce7;margin-left:15px;display: inline-block;}
    .on{float: right;background: #2a8ce7;color:#fff;z-index:990;}
    .off{background: red;color:#fff;float: right;z-index: 888;margin-left:20px;}
  }
  .open{background: #2a8ce7;color:#fff;border:1px solid #2a8ce7;margin-left: 40px;}
  .config{background:#f9fafc;font-size:16px;margin:30px 0;height: 40px;line-height: 40px;}
  .area{position: relative;margin-left:40px;width:60%;
    span{position: absolute;bottom:15px;right: 0;color:#999;}
    textarea{width:100%;border:1px solid #eaedf1; }
  }
  .checkbox{ margin-bottom:30px;padding-left:40px;
    .el-checkbox{padding:0;}
    .tip{color:#999;}
  }
  .stopBtn{display: inline-block;float: right;}
  .save{margin-left:0px;}
  .is-disabled{background: #7abafc!important;color:#fff;border:1px solid #fff;}
  .is-disabled:hover{background: #7abafc;color:#fff;border:1px solid #fff;}
  textarea:focus{outline: none !important; border: #2a8ce7 1px solid; box-shadow: none; }
  .checkbox{position: relative;overflow: hidden;zoom: 1;z-index: 99;
    .check{position: absolute;z-index: 999;background: rgba(255,255,255,.6);width:40%;height: 80%;;}

  }
</style>
