<template>
  <section>
    <nav-title title="仪表盘">
      <el-select v-model="bot" filterable placeholder="请选择机器人" class="select">
        <el-option
          v-for="item in getBotList"
          :key="item.BotConfigId"
          :label="item.AliasName"
          :value="item.BotConfigId">
        </el-option>
      </el-select>
    </nav-title>
    <el-row :gutter="20" class="col">
      <el-col :span="8" style="min-width: 380px;">
        <el-card class="box-card">
          <div slot="header" class="header">
            <i class="user icon"></i>
            <span class="title">昨日用户访问量</span>
          </div>
          <div v-if='Data.VisitCount<0' class="content">
            <div class="count">
              <span class="user-primary-color">{{Data.VisitCount}}</span>
              <span>人</span>
            </div>
            <div class="percent">
              <span>日：{{Data.DailyVisitCountRise}}<span class="rise percent-icon"></span></span>
              <span>周：{{Data.WeeklyVisitCountRise}}<span class="rise percent-icon"></span></span>
              <span>月：{{Data.MonthlyVisitCountRise}}<span class="rise percent-icon" style="margin-right: 0"></span></span>
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
      <el-col :span="8" style="min-width: 380px;">
        <el-card class="box-card" >
          <div slot="header">
            <i class="interaction icon"></i>
            <span class="title">昨日人机交互量</span>
          </div>
          <div v-if='Data.VisitCount<0' class="content">
            <div class="count">
              <span class="interaction-primary-color">{{Data.VisitCount}}</span>
              <span>次</span>
            </div>
            <div class="percent">
              <span>日：{{Data.DailyVisitCountRise}}<span class="rise percent-icon"></span></span>
              <span>周：{{Data.WeeklyVisitCountRise}}<span class="rise percent-icon"></span></span>
              <span>月：{{Data.MonthlyVisitCountRise}}<span class="rise percent-icon" style="margin-right: 0"></span></span>
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
        <el-card class="box-card" >
          <div slot="header">
            <i class="time icon"></i>
            <span class="title">累计昨日节约时间</span>
          </div>
          <div class="content" v-if="Data.VisitCount < 0" >
            <div class="count">
              <span class="save-primary-color">{{Data.VisitCount}}</span>
              <span>分钟</span>
            </div>
            <div class="percent" style="transform: translateY(-7px)">
              <span>相当于节约<span class="save save-primary-color">{{31}}</span>天</span>
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
      <el-col :span="8" style="min-width: 380px;">
        <el-card class="box-card" body-style="height:363px;box-sizing:border-box;position:relative">
          <div slot="header">
            <i class="question icon"></i>
            <span class="title">昨日提问分布</span>
          </div>
          <div v-if='Data.VisitCount<0' id="myChart" style="height: 100%;width:100%;position: absolute;right: 0;top: 40px;">
          </div>
          <div v-else class="no-question-data">
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
      <el-col :span="8" style="min-width: 380px;">
        <el-card class="box-card" body-style="height:363px;box-sizing:border-box;">
          <div slot="header">
            <i class="hot icon"></i>
            <span class="title">昨日热点问题</span>
          </div>
          <div v-if='Data.VisitCount<0' class="hot-list">
              <div v-for="(item, index) in hotQuestionList" :key="index" >
              <span>
                {{item.FriendlyName}}
              </span>
                <span>
                <span :class="isRise(item.Rise)"></span>
              </span>
              </div>
          </div>
          <div v-else class="no-data hot-list-no-data" style="position: relative;width: 100%;">
            <ul style='height: 100%;'>
              <li v-for="(item,index) in hotQuestionList"></li>
            </ul>
            <div style="position: absolute;top: 50%;left: 50%;width: 100%;transform:translate(-50%, -50%)">
              <span class="no-data-icon"></span>
              <span class="text">暂无数据</span>
              <div style="height: 54px;"></div></div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8" class="unknown-box">
        <el-row>
          <el-card class="box-card unknown-card" body-style="height:122px;box-sizing:border-box;">
            <div slot="header">
              <i class="unknown icon"></i>
              <span class="title">昨日未知问题数量</span>
              <el-button type="text" class="downLoad">问题导出</el-button>
            </div>
            <div class="total">
              <span>{{Data.UnknowQANum}}</span>
              <span>个</span>
            </div>
          </el-card>
        </el-row>
        <el-row class="margin-top-20">
          <el-card class="box-card port-visitor" body-style="height:170px;box-sizing:border-box;">
            <div slot="header">
              <i class="port icon"></i>
              <span class="title">昨日端口访问量</span>
            </div>
            <div class="progress">
              <span :style="{width:Data.WechatChannelNum}">
                <span>{{Data.WechatChannelNum}}</span>
                <span :style="{height:'15px',width:'100%',background:'#288288'}"></span>
              </span>
              <span :style="{width:Data.WebChannelNum}">
                <span>{{Data.WebChannelNum}}</span>
                <span :style="{height:'15px',width:'100%',background:'#24a5ae'}"></span>
              </span>
              <span :style="{width:Data.RobotChannelNum}">
                <span>{{Data.RobotChannelNum}}</span>
                <span :style="{height:'15px',width:'100%',background:'#2ec6d1'}"></span>
              </span>
              <span :style="{width:Data.MiniProgramChannelNum}">
                <span>{{Data.MiniProgramChannelNum}}</span>
                <span :style="{height:'15px',width:'100%',background:'#8fe0e6'}"></span>
              </span>
            </div>
            <div class="tooltip">
              <span><i style="background: #288288"></i>微信端</span>
              <span><i style="background: #24a5ae"></i>网页端</span>
              <span><i style="background: #2ec6d1"></i>桌面</span>
              <span><i style="background: #8fe0e6"></i>实体机器人</span>
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
  import {QUERYBOT} from "../../constants/api";
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
        bot: null,
        Data: {
          VisitCount: 5700,
          InteractCount: 9280,
          SaveTime: 44640,
          ProfessionQANum: '',
          ChatQANum: '',
          UnknowQANum: 980,
          WechatChannelNum: '30%',
          WebChannelNum: '30%',
          RobotChannelNum: '10%',
          MiniProgramChannelNum: '30%',
          DailyVisitCountRise: '0.32%',
          DailyInteractCountRise: '1.38%',
          WeeklyVisitCountRise: '1.62%',
          WeeklyInteractCountRise: '',
          MonthlyVisitCountRise: '8.88%',
          MonthlynteractCountRise: '1.28%',
          UnknownQFileUrl:''
      },
        hotQuestionList:[
          {
            IntentName:'3502eda0-87d7-4a37-b9db-b0f85b32d276',
            FriendlyName:'办理居住证',
            Count: 630,
            Ranking: 1,
            Rise:1,
          },
          {
            IntentName:'3502eda0-87d7-4a37-b9db-b0f85b32d276',
            FriendlyName:'办理居住证材料',
            Count: 630,
            Ranking: 2,
            Rise:-1,
          },
          {
            IntentName:'3502eda0-87d7-4a37-b9db-b0f85b32d276',
            FriendlyName:'办理居住证时间',
            Count: 630,
            Ranking: 2,
            Rise: 0,
          },
          {
            IntentName:'3502eda0-87d7-4a37-b9db-b0f85b32d276',
            FriendlyName:'办理居住证时间',
            Count: 630,
            Ranking: 2,
            Rise: 0,
          },
          {
            IntentName:'3502eda0-87d7-4a37-b9db-b0f85b32d276',
            FriendlyName:'办理居住证时间',
            Count: 630,
            Ranking: 2,
            Rise: 0,
          },
          {
            IntentName:'3502eda0-87d7-4a37-b9db-b0f85b32d276',
            FriendlyName:'办理居住证时间',
            Count: 630,
            Ranking: 2,
            Rise: 0,
          },
          {
            IntentName:'3502eda0-87d7-4a37-b9db-b0f85b32d276',
            FriendlyName:'办理居住证时间',
            Count: 630,
            Ranking: 2,
            Rise: 0,
          },
        ],
        show: false,
        PageIndex:0,
        PageSize:0,
        getBotList:[]
      }
    },
    created(){
      this.getBotListFetch()
    },
    mounted() {
      this.drawLine();
    },
    components:{
      NavTitle,
    },
    methods:{
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
            this.getBotList = res.Data
            console.log(res)
          }
        )
        return [
          {id: 1, name: '工作助理机器人'},
          {id: null, name: '全部机器人'},

        ]
      },
      drawLine() {
        // 基于准备好的dom，初始化echarts实例
        let myChart = echarts.init(document.getElementById('myChart'))
        const that = this
        // 绘制图表
        myChart.setOption({
          color: ['#2a8be7', '#f39504', '#999999'],
          tooltip: {
            show:false,
            type:'hideTip',
            trigger: 'item',
            formatter: null
          },
          legend: {
            orient: 'vertical',
            x: 'left',
            icon:"circle",
            textStyle:{
              fontSize:14,
              color: '#999999'
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
                  textStyle: {
                    fontSize: 14,
                    color: '#999999'
                  },
                  formatter(params){
                    return params.value/100
                  }
                },
                emphasis: {
                  show: true,
                  formatter(params){
                    return params.value/100
                  }
                }
              },
              labelLine: {
                normal: {
                  lineStyle: {
                    color: '#999999'
                  },
                }
              },
              data:[
                {value:8076, name:'专业知识/业务咨询', itemStyle:{normal:{color:'#2a8be7'},emphasis:{color:'#2a8be7'}}},
                {value:310, name:'闲聊', itemStyle:{normal:{color:'#f39504'},emphasis:{color:'#f39504'}}},
                {value:890, name:'未知问题', itemStyle:{normal:{color:'#999999'},emphasis:{color:'#999999'}}},
              ]
            }
          ]
        });
      },
      isRise(className){
        if(className){
          if(className>0){
            return ['rise', 'hot-icon']
          }else{
            return ['decline', 'hot-icon']
          }
        }else{
          return ['keep', 'hot-icon']
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
      padding-left: 20px;
      padding-right: 20px;
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

    .text{
      font-size: 16px;
      vertical-align: middle;
    }
    .keep{
      display: inline-block;
      height: 3px;
      vertical-align: middle;
      width: 20px;
      background: $disabled;
    }
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
  @media screen and (max-width: 1440px) {
    .save-box,.unknown-box,.port-box{
      width: 30%;
      min-width: 270px;
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
      min-width: 270px;
    }
  }
</style>
