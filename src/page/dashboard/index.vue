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
          <div v-for="o in 4" :key="o" class="text item">
            {{'列表内容 ' + o }}
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-row>
          <el-card class="box-card" body-style="height:174px;">
            <div slot="header">
              <i class="unknown icon"></i>
              <span class="title">昨日未知问题数量</span>
            </div>
            <div v-for="o in 4" :key="o" class="text item">
              {{'列表内容 ' + o }}
            </div>
          </el-card>
        </el-row>
        <el-row class="margin-top-20">
          <el-card class="box-card">
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
          UnknowQANum: '',
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
          tooltip: {
            type:'pieSelect',
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
          },
          legend: {
            orient: 'vertical',
            x: 'left',
            icon:"circle",
            data:['直接访问','邮件营销','联盟广告']
          },
          series: [
            {
              name:'访问来源',
              type:'pie',
              radius: ['50%', '70%'],
              avoidLabelOverlap: false,
              label: {
                normal: {
                  show: false,
                  position: 'center'
                },
                itemStyle: {
                  emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  },
                  normal:{
                    color:function(params) {
                      //自定义颜色
                      var colorList = [
                        '#00FFFF', '#00FF00', '#FFFF00', '#FF8C00', '#FF0000', '#FE8463',
                      ];
                      return colorList[params.dataIndex]
                    }
                  }
                },
                emphasis: {
                  show: true,
                  textStyle: {
                    fontSize: '30',
                    fontWeight: 'bold'
                  }
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data:[
                {value:335, name:'直接访问'},
                {value:310, name:'邮件营销'},
                {value:234, name:'联盟广告'},
              ]
            }
          ]
        });
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
    margin-left: 14px;
    font-size: 16px;
    color:$f-pri-c;
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
    background: url("../../assets/dashboard/rise.png");
    background-size: auto;
  }
  .decline{
    background: url("../../assets/dashboard/decline.png");
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

</style>
