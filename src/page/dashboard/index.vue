<template>
  <section>
    <nav-title title="仪表盘">
      <el-select v-model="bot" placeholder="请选择机器人" class="select">
        <el-option
          v-for="item in getBotList()"
          :key="item.id"
          :label="item.name"
          :value="item.id">
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
          <div class="content">
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
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card" >
          <div slot="header">
            <i class="interaction icon"></i>
            <span class="title">昨日人机交互量</span>
          </div>
          <div class="content">
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
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card" >
          <div slot="header">
            <i class="time icon"></i>
            <span class="title">累积节约时间</span>
          </div>
          <div class="content">
            <div class="count">
              <span class="save-primary-color">{{Data.VisitCount}}</span>
              <span>分钟</span>
            </div>
            <div class="percent" style="transform: translateY(-7px)">
              <span>相当于节约<span class="save save-primary-color">{{31}}</span>天</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="col second">
      <el-col :span="8">
        <el-card class="box-card" body-style="height:362px;">
          <div slot="header">
            <i class="question icon"></i>
            <span class="title">昨日提问分布</span>
          </div>
          <div id="myChart" style="height: 100%;width:100%;padding-left: 20px;padding-right: 20px;">
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card" body-style="height:362px">
          <div slot="header">
            <i class="hot icon"></i>
            <span class="title">昨日热点问题</span>
          </div>
          <div class="hot-list">
            <div v-for="(item, index) in hotQuestionList" :key="o" >
              <span>
                {{item.FriendlyName}}
              </span>
              <span>
                <span class="count">{{item.Count}}次</span>
                <span :class="isRise(item.Rise)"></span>
              </span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-row>
          <el-card class="box-card unknown-card" body-style="height:122px;box-sizing:border-box">
            <div slot="header">
              <i class="unknown icon"></i>
              <span class="title">昨日未知问题数量</span>
              <el-button type="text" class="downLoad">文字按钮</el-button>
            </div>
            <div>
              <span>{{Data.UnknowQANum}}</span>
              <span>个</span>
            </div>
          </el-card>
        </el-row>
        <el-row class="margin-top-20">
          <el-card class="box-card" body-style="height:122px;box-sizing:border-box">
            <div slot="header">
              <i class="port icon"></i>
              <span class="title">昨日端口访问量</span>
            </div>
            <div v-for="o in 4" :key="o" class="text item">
              {{'列表内容 ' + o }}
            </div>
          </el-card>
        </el-row>

      </el-col>
    </el-row>
  </section>
</template>
<script>

  import NavTitle from '../../components/NavTitle';
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
          WechatChannelNum: '',
          WebChannelNum: '',
          RobotChannelNum: '',
          MiniProgramChannelNum: '',
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

        ]
      }
    },
    mounted() {
      this.drawLine();
    },
    components:{
      NavTitle,
    },
    methods:{
      getBotList(){
        return [
          {id: 1, name: '工作助理机器人'},
          {id: null, name: '全部机器人'},

        ]
      },
      drawLine() {
        // 基于准备好的dom，初始化echarts实例
        let myChart = echarts.init(document.getElementById('myChart'))
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
            data:['专业知识/业务咨询','闲聊','未知问题']
          },
          series: [
            {
              name:'sss',
              type:'pie',
              radius: ['50%', '70%'],
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
                  show: false,
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
    margin-bottom: 20px;
    &:last-child{
      margin-bottom: 0;
    }
  }
  .select{
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
      margin-bottom: 38px;
      span:first-child{
        height: 60px;
        line-height: 60px;
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
    {
      height: 175px;
      line-height: 175px;
      text-align: center;
      span:first-child{
        font-size: 54px;
        color: #f26f5e;
      }
    }
  }
</style>
