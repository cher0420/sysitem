<template>
  <section>
    <nav-title title="仪表盘">
      <el-select v-model="BotConfigId" filterable placeholder="请选择机器人" class="select" @change="refreshData()">
        <el-option
          v-for="item in getBotList"
          :key="item.BotConfigId"
          :label="item.AliasName"
          :value="item.BotConfigId">
        </el-option>
      </el-select>
    </nav-title>
    <el-row :gutter="20" class="col">
      <el-col :span="8" style="min-width: 370px;">
        <el-card class="box-card" v-loading="loading">
          <div slot="header" class="header">
            <i class="user icon"></i>
            <span class="title">昨日用户访问量</span>
          </div>
          <div v-if='Data.SaveTime' class="content">
            <div class="count">
              <span class="user-primary-color">{{Data.VisitCount}}</span>
              <span>人</span>
            </div>
            <div class="percent">
              <span>日：{{Data.DailyVisitCountRise}}<span :class="Data.DailyVisitCountRise != 0?Data.DailyVisitCountRise >0?['rise','percent-icon']:['decline','percent-icon']:['keep','percent-icon']"></span></span>
              <span>周：{{Data.WeeklyVisitCountRise}}<span :class="Data.WeeklyVisitCountRise != 0?Data.WeeklyVisitCountRise >0?['rise','percent-icon']:['decline','percent-icon']:['keep','percent-icon']"></span></span>
              <span>月：{{Data.MonthlyVisitCountRise}}<span :class="Data.MonthlyVisitCountRise != 0?Data.MonthlyVisitCountRise >0?['rise','percent-icon']:['decline','percent-icon']:['keep','percent-icon']" style="margin-right: 0"></span></span>
            </div>
          </div>
          <div v-else class="no-data">
            <span class="no-data-icon"></span>
            <span class="text">暂无数据</span>
            <div class='details' style="height: 54px;">
              <span>日： <span class="keep"></span></span>
              <span>周： <span class="keep"></span></span>
              <span>月： <span class="keep"></span></span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8" style="min-width: 370px;">
        <el-card class="box-card" v-loading="loading">
          <div slot="header">
            <i class="interaction icon"></i>
            <span class="title">昨日人机交互量</span>
          </div>
          <div v-if='Data.SaveTime' class="content">
            <div class="count">
              <span class="interaction-primary-color">{{Data.InteractCount}}</span>
              <span>次</span>
            </div>
            <div class="percent">
              <span>日：{{Data.DailyInteractCountRise}}<span :class="Data.DailyInteractCountRise != 0?Data.DailyInteractCountRise >0?['rise','percent-icon']:['decline','percent-icon']:['keep','percent-icon']"></span></span>
              <span>周：{{Data.WeeklyInteractCountRise}}<span :class="Data.WeeklyInteractCountRise != 0?Data.WeeklyInteractCountRise >0?['rise','percent-icon']:['decline','percent-icon']:['keep','percent-icon']"></span></span>
              <span>月：{{Data.MonthlynteractCountRise}}<span :class="Data.MonthlynteractCountRise != 0?Data.MonthlynteractCountRise >0?['rise','percent-icon']:['decline','percent-icon']:['keep','percent-icon']" style="margin-right: 0"></span></span>
            </div>
          </div>
          <div v-else class="no-data">
            <span class="no-data-icon"></span>
            <span class="text">暂无数据</span>
            <div class='details' style="height: 54px;">
              <span>日： <span class="keep"></span></span>
              <span>周： <span class="keep"></span></span>
              <span>月： <span class="keep"></span></span>
            </div>
          </div>

        </el-card>
      </el-col>
      <el-col :span="8" class="save-box">
        <el-card class="box-card" v-loading="loading">
          <div slot="header">
            <i class="time icon"></i>
            <span class="title">累计昨日节约时间</span>
          </div>
          <div class="content" v-if="Data.SaveTime" >
            <div class="count">
              <span class="save-primary-color">{{Data.SaveTimeHours <= 99999? Data.SaveTime <= 99999?Data.SaveTime:Data.SaveTimeHours:(Data.SaveTimeHours/10000).toFixed()}}</span>
              <span>{{Data.SaveTimeHours<=99999?Data.SaveTime <= 99999?'分钟':'小时':'万小时'}}</span>
            </div>
            <div class="percent" style="transform: translateY(-7px)">
              <span>相当于节约<span class="save save-primary-color">{{(Data.SaveTimeHours/8).toFixed(1)}}</span>人天</span>
            </div>
          </div>
          <div v-else class="no-data">
              <span class="no-data-icon"></span>
              <span class="text">暂无数据</span>
              <div style="height: 54px;"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="col second">
      <el-col :span="8" style="min-width: 370px;">
        <el-card class="box-card" body-style="height:363px;box-sizing:border-box;position:relative" v-loading="loading">
          <div slot="header">
            <i class="question icon"></i>
            <span class="title">昨日提问分布</span>
          </div>
          <div id="myChart" v-show='Data.SaveTime'>
          </div>
          <div v-show='Data.SaveTime <= 0' class="no-question-data">
            <ul>
              <li><span></span>专业知识/业务咨询</li>
              <li><span></span>闲聊</li>
              <li><span></span>未知问题</li>
            </ul>
            <div class="no-data" style="margin-top: 38px;">
              <span class="no-data-icon"></span>
              <span class="text">暂无数据</span>
              <div style="height: 54px;"></div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8" style="min-width: 370px;">
        <el-card class="box-card" body-style="height:363px;box-sizing:border-box;" v-loading="hotLoading">
          <div slot="header">
            <i class="hot icon"></i>
            <span class="title">昨日热点问题</span>
          </div>
          <div v-if='Data.SaveTime' class="hot-list">
              <div v-for="(item, index) in hotQuestionList" :key="index" >
              <span>
                {{item.FriendlyName}}
              </span>
                <span>
                <span :class="isRise(item.Rise, 'hot-icon')"></span>
              </span>
              </div>
          </div>
          <div v-else class="no-data hot-list-no-data" style="position: relative;width: 100%;">
            <ul style='height: 100%;'>
              <li v-for="(item,index) in hotQuestionListNoData"></li>
            </ul>
            <div style="position: absolute;top: 50%;left: 50%;width: 100%;transform:translate(-50%, -50%)">
              <span class="no-data-icon"></span>
              <span class="text">暂无数据</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8" class="unknown-box">
        <el-row>
          <el-card class="box-card unknown-card" body-style="height:122px;box-sizing:border-box;" v-loading="loading">
            <div slot="header">
              <i class="unknown icon"></i>
              <span class="title">昨日未知问题数量</span>
              <el-button :disabled="Data.UnknowQANum<=0|| !Data.SaveTime" type="text" class="downLoad">
                <a :href="Data.UnknowQANum<=0|| !Data.SaveTime?'javascript:;':Data.UnknownQFileUrl"
                   :style="{opacity:Data.UnknowQANum<=0|| !Data.SaveTime?'.5':'1',
                            cursor:Data.UnknowQANum<=0|| !Data.SaveTime?'default':'pointer'
                   }"
                >问题导出</a>
              </el-button>
            </div>
            <div v-if='Data.SaveTime' class="total">
              <span>{{Data.UnknowQANum}}</span>
              <span>个</span>
            </div>
            <div v-else style="text-align: center">
              <span class="no-data-icon"></span>
              <span class="text">暂无数据</span>
            </div>
          </el-card>
        </el-row>
        <el-row class="margin-top-20">
          <el-card class="box-card port-visitor" body-style="height:170px;box-sizing:border-box;position:relative;" v-loading="loading">
            <div slot="header">
              <i class="port icon"></i>
              <span class="title">昨日端口访问量</span>
            </div>
            <div v-if="Data.SaveTime">
              <div class="progress">
              <span :style="{width:Data.WechatChannelNumPrecent}">
                <span>{{Data.WechatChannelNumPrecent}}</span>
                <span :style="{height:'15px',width:'100%',background:'#288288'}"></span>
              </span>
                <span :style="{width:Data.WebChannelNumPrecent}">
                <span>{{Data.WebChannelNumPrecent}}</span>
                <span :style="{height:'15px',width:'100%',background:'#24a5ae'}"></span>
              </span>
                <span :style="{width:Data.RobotChannelNumPrecent}">
                <span>{{Data.RobotChannelNumPrecent}}</span>
                <span :style="{height:'15px',width:'100%',background:'#2ec6d1'}"></span>
              </span>
                <span :style="{width:Data.MiniProgramChannelNumPrecent}">
                <span>{{Data.MiniProgramChannelNumPrecent}}</span>
                <span :style="{height:'15px',width:'100%',background:'#8fe0e6'}"></span>
              </span>
              </div>
              <div class="tooltip">
                <span><i style="background: #288288"></i>微信端</span>
                <span><i style="background: #24a5ae"></i>网页端</span>
                <span><i style="background: #2ec6d1"></i>桌面</span>
                <span><i style="background: #8fe0e6"></i>实体机器人</span>
              </div>
            </div>
            <div v-else style="text-align: center;position: absolute;top: 50%;left: 50%;transform:translate(-50%,-50%)">
              <span class="no-data-icon"></span>
              <span class="text">暂无数据</span>
            </div>
          </el-card>
        </el-row>
      </el-col>
    </el-row>
  </section>
</template>
<script>

  import NavTitle from '../../components/NavTitle';
  import {request} from "../../serive/request";
  import {getCookies} from "../../utils/cookie";
  import {TOKEN} from "../../constants/constants";
  import {QUERYBOT,STATUSMETRICS,HOTQA} from "../../constants/api";
  import store from '../../store/index'
  // 引入基本模板
  let echarts = require('echarts/lib/echarts')
  // 引入柱状图组件
  require('echarts/lib/chart/pie')
  // 引入提示框和title组件
  require('echarts/lib/component/tooltip')
  require('echarts/lib/component/title')
  require('echarts/lib/component/legend')
  export default {
    data(){
      return {
        BotConfigId: null,
        Data: {
          VisitCount: 0,
          InteractCount: 0,
          SaveTime: 0,
          ProfessionQANum: '',
          ChatQANum: '',
          UnknowQANum: 0,
          WechatChannelNum: '30%',
          WebChannelNum: '30%',
          RobotChannelNum: '10%',
          MiniProgramChannelNum: '30%',
          DailyVisitCountRise: '-1.38',
          DailyInteractCountRise: '0',
          WeeklyVisitCountRise: '0',
          WeeklyInteractCountRise: '2',
          MonthlyVisitCountRise: '8.88',
          MonthlynteractCountRise: '1.28',
          UnknownQFileUrl:''
      },
        hotQuestionList:[],
        hotQuestionListNoData:[
            {
              Count: '',
              FriendlyName: "",
              IntentName: "",
              Ranking: '',
              Rise: ''
            },
          {
            Count: '',
            FriendlyName: "",
            IntentName: "",
            Ranking: '',
            Rise: ''
          },
          {
            Count: '',
            FriendlyName: "",
            IntentName: "",
            Ranking: '',
            Rise: ''
          },
          {
            Count: '',
            FriendlyName: "",
            IntentName: "",
            Ranking: '',
            Rise: ''
          },
          {
            Count: '',
            FriendlyName: "",
            IntentName: "",
            Ranking: '',
            Rise: ''
          },
          {
            Count: '',
            FriendlyName: "",
            IntentName: "",
            Ranking: '',
            Rise: ''
          },
          {
            Count: '',
            FriendlyName: "",
            IntentName: "",
            Ranking: '',
            Rise: ''
          }
          ],
        loading: true,
        hotLoading: true,
        show: false,
        PageIndex:0,
        PageSize:0,
        getBotList:[]
      }
    },
    created(){
      this.getStatusMetrics()
      this.getBotListFetch()
      this.getHotQA()
    },
    mounted() {

    },
    components:{
      NavTitle,
    },
    methods:{
      refreshData(id){
        this.getStatusMetrics()
        this.getHotQA()
      },
      getHotQA(){
        const that = this
        that.hotLoading = true
        const TenantId = store.state.app.userInfo.TenantId

        const params = {
          method: 'POST',
          headers:{
            'Access-Token': getCookies(TOKEN)
          },
          body:JSON.stringify({TenantId:TenantId,BotConfigId:this.BotConfigId,"PreStartDate":"2019-4-1 00:00:00",
            "PreEndDate":"2019-4-10 23:59:59",
            "CurrStartDate":"2019-4-11 00:00:00",
            "CurrEndDate":"2019-4-21 23:59:59"})
        }
        request(HOTQA, params).then(
          (res) =>{
            this.hotQuestionList = []
            res.Data.forEach(
              (item, index, arr) => {
                if(item.Ranking === index+1){
                  this.hotQuestionList.push(item)
                }
              }
            )
            setTimeout(
              () => {
                that.hotLoading = false
              },500
            )
          }
        ).catch(
          () => {
            this.hotLoading = false
          }
        )
      },
      getStatusMetrics(){
        this.loading = true
        const TenantId = store.state.app.userInfo.TenantId

        const params = {
          method: 'POST',
          headers:{
            'Access-Token': getCookies(TOKEN)
          },
          body:JSON.stringify({TenantId:TenantId,BotConfigId:this.BotConfigId,"PreStartDate":"2019-4-1 00:00:00",
            "PreEndDate":"2019-4-10 23:59:59",
            "CurrStartDate":"2019-4-11 00:00:00",
            "CurrEndDate":"2019-4-21 23:59:59"})
        }
        request(STATUSMETRICS, params).then(
          (res) =>{
            // res.Data = null
            const data = res.Data?res.Data:this.Data

            data.WechatChannelNumPrecent = (data.WechatChannelNum/( data.WechatChannelNum+ data.WebChannelNum+data.RobotChannelNum+data.MiniProgramChannelNum)*100).toFixed()+'%'
            data.WebChannelNumPrecent = (data.WebChannelNum/( data.WechatChannelNum+ data.WebChannelNum+data.RobotChannelNum+data.MiniProgramChannelNum)*100).toFixed()+'%'
            data.RobotChannelNumPrecent = (data.RobotChannelNum/( data.WechatChannelNum+ data.WebChannelNum+data.RobotChannelNum+data.MiniProgramChannelNum)*100).toFixed()+'%'
            data.MiniProgramChannelNumPrecent = (data.MiniProgramChannelNum/( data.WechatChannelNum+ data.WebChannelNum+data.RobotChannelNum+data.MiniProgramChannelNum)*100).toFixed()+'%'

            res.Data.SaveTimeHours = (res.Data.SaveTime/60).toFixed()

            this.Data = data

            setTimeout(
              () => {
                this.loading = false
              },500
            )
            this.drawLine(this.Data);


          }
        ).catch(
          () => {
            this.loading = false
          }
        )
      },
      getBotListFetch(){
        const TenantId = store.state.app.userInfo.TenantId
        const params = {
          method: 'POST',
          headers:{
            'Access-Token': getCookies(TOKEN)
          },
          body:JSON.stringify({TenantId:TenantId,PageIndex:this.PageIndex,PageSize:this.PageSize})
        }
        request(QUERYBOT,params).then(
          (res) => {
            const all = {
              AliasName: '全部机器人',
              BotConfigId: null,
              TenantId: null
            }
            this.getBotList = res.Data?[all, ...res.Data]:[all]
            this.hotLoading = false
          }
        )
      },
      drawLine(data) {
        // 基于准备好的dom，初始化echarts实例
        const that = this
        if(document.getElementById('myChart')){
          // 绘制图表
          let myChart = echarts.init(document.getElementById('myChart'))
          myChart.setOption({
            color: ['#2a8be7', '#f39504', '#999999'],
            tooltip : {             // Series config.
              trigger: 'item',
              backgroundColor: '#fff',
              position : function (point, params, dom, rect, size) {
                // 固定在顶部
                const domWidth = dom.offsetWidth
                return [size.viewSize[0]/2-domWidth/15,size.viewSize[1]/2-10];
              },
              textStyle:{
                textAlign: 'center',
                width: 200,
                height: 50
              },
              formatter: '<div><span style="color: #2a8be7; font-size: 30px">'+'{c}'+'</span><span style="color: #555; font-size: 16px">条</span></div>',
            },
            legend: {
              orient: 'vertical',
              x: 'left',
              icon:"circle",
              textStyle:{
                fontSize:14,
                color: '#555'
              },
              data:['专业知识/业务咨询','闲聊','未知问题']
            },
            grid:{
              x:'20%',
              y: '20%'
            },
            series: [
              {
                center:['62%', '51%'],
                name:'sss',
                type:'pie',
                radius: ['40%', '60%'],
                avoidLabelOverlap: false,
                label: {
                  normal: {
                    show: true,
                    position:'left',
                    textStyle: {
                      fontSize: 14,
                      color: '#555'
                    },
                    formatter(params){
                      const value = (params.value/(data.ProfessionQANum + data.ChatQANum + data.UnknowQANum)*100).toFixed()+'%'
                      return [value, params.name].join('\n')
                    }
                  },
                  emphasis: {
                    show: true,
                    formatter(params){
                      const value = (params.value/(data.ProfessionQANum + data.ChatQANum + data.UnknowQANum)*100).toFixed()+'%'
                      return [value, params.name].join('\n')
                    }
                  }
                },
                labelLine: {
                  normal: {
                    show: true,
                    lineStyle: {
                      color: '#555'
                    },
                  }
                },
                data:[
                  {value:data.UnknowQANum, name:'未知问题', itemStyle:{normal:{color:'#999999'},emphasis:{color:'#999999'}}},
                  {value:data.ChatQANum, name:'闲聊', itemStyle:{normal:{color:'#f39504'},emphasis:{color:'#f39504'}}},
                  {value:data.ProfessionQANum, name:'专业知识/业务咨询', itemStyle:{normal:{color:'#2a8be7'},emphasis:{color:'#2a8be7'}}},
                ]
              }
            ]
          });
        }
      },
      isRise(value,className = ''){
        if(value){
          if(value>0){
            return ['rise', className]
          }else{
            return ['decline', className]
          }
        }else{
          return ['keep', className]
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import '../../style/card';
  @import '../../style/var/color';
  .col{
    color: $f-pri-c;
    margin-bottom: 20px;
    &:last-child{
      margin-bottom: 0;
    }
  }
  .select{
    max-width: 300px;
    width: 20%;
    float: right;
  }
  .second{
    margin-bottom: 20px
  }
 .margin-top-20{
   margin-top: 20px;
 }
  .title{
    display: inline-block;
    margin-left: 14px;
    font-size: 16px;
    color:$f-pri-c;
    height: 26px;
    line-height: 26px;
    vertical-align: middle;
  }
  .icon{
    display: inline-block;
    width: 24px;
    height: 24px;
    vertical-align: middle;
  }
  .user{
    background: url('../../assets/dashboard/user.png') no-repeat center;
    background-size: auto;
  }
  .interaction{
    background: url('../../assets/dashboard/interaction.png') no-repeat center;
    background-size: auto;
  }
  .time{
    background: url('../../assets/dashboard/time.png') no-repeat center;
    background-size: auto;
  }
  .question{
    background: url('../../assets/dashboard/question.png') no-repeat center;
    background-size: auto;
  }
  .hot{
    background: url('../../assets/dashboard/hot.png') no-repeat center;
    background-size: auto;
  }
  .unknown{
    background: url('../../assets/dashboard/unknown.png') no-repeat center;
    background-size: auto;
  }
  .percent-icon{
    display: inline-block;
    width: 10px;
    height: 14px;
    margin:0 14px 0 8px;
  }
  .rise{
    background: url("../../assets/dashboard/rise.png") no-repeat center;
    background-size: auto;
  }
  .decline{
    background: url("../../assets/dashboard/decline.png") no-repeat center;
    background-size: auto;
  }
  .keep{
    background: url("../../assets/dashboard/keep.png") no-repeat center;
    background-size: auto;
  }
  .port{
    background: url("../../assets/dashboard/port.png") no-repeat center;
    background-size: auto;
  }
  .user-primary-color{
    color: #2ec6d1;
  }
  .interaction-primary-color{
    color: #8bc657
  }
  .save-primary-color{
    color: #ff1654;
  }
  .content{
    color: $f-pri-c;
    text-align: center;
    .count{
      height: 50px;
      margin-bottom: 38px;
      span:first-child{
        height: 50px;
        line-height: 50px;
        font-size: 60px;
      }
      span{
        font-size: 24px;
      }
    }
    .percent{
      font-size: 0;
      color: $f-pri-c;
      height: 16px;
      line-height: 16px;
      span{
        font-size: 16px;
      }
      .save{
        font-size: 30px;
        line-height: 16px;
        height:16px;
      }
    }
  }
  .hot-list{
    box-sizing: border-box;
    width: 100%;
    font-size: 14px;
    color:$f-pri-c;
    border:1px solid $border-color;
    div{
      height: 40px;
      line-height: 40px;
      padding:0 15px;
    }
    div:nth-child(odd){
      background: #f9fafc;
    }
    span:first-child{
      float:left;
    }
    span:last-child{
      float:right;
    }
    .count{
      margin-right: 12px;
      margin-left: 15px;
    }
    .hot-icon{
      display: inline-block;
      width: 10px;
      height: 40px;
      line-height: 40px;
      vertical-align: middle;
    }
  }
  .unknown-card{
    .downLoad{
      float: right;
      padding: 0;
      height: 50px;
      line-height: 50px;
      a{
        text-decoration:none;
        out-line: none;
        color: #2a8be7;
      }
    }
     .total{
       color:$f-pri-c;
       height: 100%;
       line-height: 42px;
       text-align: center;
       font-size: 24px;
       span:first-child{
         font-size: 54px;
         color: #f26f5e;
       }
     }
  }
  .port-visitor{
    position: relative;
    font-size: 0;
    color:$f-pri-c;
    .progress span{
      display: inline-block;
      font-size: 12px;
      height: 12px;
      line-height: 12px;
    }
    .progress>span{
      span:first-child{
        margin-bottom: 6px;
      }
    }
    .tooltip{
      width: 100%;
      box-sizing: border-box;
      position: absolute;
      left: 0;
      bottom: 40px;
      font-size: 12px;
      span{
        display: inline-block;
        float:left;
        width: 25%;
      }

      i{
        display: inline-block;
        width: 16px;
        height:16px;
        border-radius: 50%;
        vertical-align: middle;
      }
    }
  }
  .no-data-icon{
    display: inline-block;
    width: 45px;
    height: 45px;
    vertical-align: middle;
    background: url("../../assets/dashboard/noData.png") no-repeat center;
  }
  .no-data{
    text-align: center;
    height: 104px;
    color: $disabled;
    box-sizing: border-box;
    padding-top: 5px;

    .details{
      height: 16px;
      line-height: 16px;
      padding-top: 38px;
      font-size: 16px;
      box-sizing: border-box;
    }
    .details>span{
      display: inline-block;
      width: 32%;
      text-align: center;
    }

    .keep{
      display: inline-block;
      height: 3px;
      vertical-align: middle;
      width: 20px;
      background: $disabled;
    }
  }
  .text{
    font-size: 16px;
    vertical-align: middle;
    color: $disabled;
  }
  .no-question-data{
    ul{
      color: $disabled;
      li{
        font-size: 14px;
        height: 14px;
        line-height: 14px;
      }
      li span{
        display: inline-block;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        vertical-align: middle;
        margin-right: 5px;

      }
      li:first-child{
        margin-bottom: 16px;
        span{
          background: #2a8ce5;
        }
      }
      li:nth-child(2){
        margin-bottom: 16px;
        span{
          background: #f49503;
        }
      }
      li:last-child{
        span{
          background: #999999;
        }
      }
    }
  }
  .hot-list-no-data{
    border: 1px solid $border-color;
    height: 100%;
    ul li{
      height: 40px;
    }
    ul li:nth-child(odd){
      background-color: #f9fafc;
    }
  }
  #myChart{
    height: 100%;width:100%;position: absolute;right: 0;top: 40px;
  }
  @media screen and (max-width: 1440px) {
    .save-box,.unknown-box,.port-box{
      width: 30%;
      min-width: 290px;
    }
    .port-visitor{
      .tooltip{
        span{
          width: 50%;
        }
      }
    }
  }
  @media screen and (max-width: 1340px) {
    .save-box,.unknown-box,.port-box{
      width: 24%;
      min-width: 290px;
    }
  }
</style>
