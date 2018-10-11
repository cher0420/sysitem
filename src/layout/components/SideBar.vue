<template>
  <section class="">
    <el-menu
      :default-active="navIndex"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      @select="handle"
      text-color="#cfd9e2"
      active-text-color="#fff"
      :collapse="isCollapse"
      :router="isRouter"
    >
      <el-menu-item index="" class="handle-item text-a-c" @click="show">
        <i class="yoy-menu-icon">2222</i>
      </el-menu-item>
      <el-menu-item index="dashboard" class="dashboard">
        <i class="yoy-menu-icon dis-i-b"></i>
        <i v-show="!isCollapse" class="el-icon-arrow-right f-s-14 side-item-rightRow"></i>
        <span class="f-s-14 yoy-menu-title p-relative margin-l-15" slot="title">仪表盘</span>
      </el-menu-item>
      <el-menu-item index="bot" class="bot">
        <i class="yoy-menu-icon dis-i-b"></i>
        <i v-show="!isCollapse" class="el-icon-arrow-right f-s-14 side-item-rightRow"></i>
        <span class="f-s-14 yoy-menu-title p-relative margin-l-15" slot="title">机器人列表</span>
      </el-menu-item>
      <el-menu-item index="skill" class="skill">
        <i class="yoy-menu-icon dis-i-b"></i>
        <i v-show="!isCollapse" class="el-icon-arrow-right f-s-14 side-item-rightRow"></i>
        <span class="f-s-14 yoy-menu-title p-relative margin-l-15" slot="title">机器人技能</span>
      </el-menu-item>
      <el-menu-item index="custom" class="custom">
        <i class="yoy-menu-icon dis-i-b"></i>
        <i v-show="!isCollapse" class="el-icon-arrow-right f-s-14 side-item-rightRow"></i>
        <span class="f-s-14 yoy-menu-title p-relative margin-l-15" slot="title">定制服务</span>
      </el-menu-item>
      <el-menu-item index="opinion" class="opinion">
        <i class="yoy-menu-icon dis-i-b"></i>
        <i v-show="!isCollapse" class="el-icon-arrow-right f-s-14 side-item-rightRow"></i>
        <span class="f-s-14 yoy-menu-title p-relative margin-l-15" slot="title">意见反馈</span>
      </el-menu-item>
      <el-menu-item index="authority" class="authority">
        <i class="yoy-menu-icon dis-i-b"></i>
        <i v-show="!isCollapse" class="el-icon-arrow-right f-s-14 side-item-rightRow"></i>
        <span class="f-s-14 yoy-menu-title p-relative margin-l-15" slot="title">权限管理</span>
      </el-menu-item>
    </el-menu>
  </section>
</template>
<script>
  import store from '../../store/index'
  import {REPLACE} from "../../store/mutations";

  export default {
    data() {
      return {
        isRouter: true,
      };
    },
    computed: {
      navIndex () {
        return store.state.app.navIndex
      },
      menus () {
        return [
          {id:'dashboard',chineseName:'仪表盘',englishName:'dashboard'},
          {id:'bot',chineseName:'机器人列表',englishName:'bot'},
          {id:'skill',chineseName:'机器人技能',englishName:'skill'},
          {id:'custom',chineseName:'定制服务',englishName:'custom'},
          {id:'opinion',chineseName:'意见反馈',englishName:'opinion'},
          {id:'authority',chineseName:'权限管理',englishName:'authority'},
        ]
      },
      isCollapse () {
        return store.state.app.isCollapse
      }
    },
    methods: {
      show(){
        store.dispatch(REPLACE, {isCollapse: !this.isCollapse}).then(
          ()=>{
            this.isCollapse?store.dispatch(REPLACE,{aSideWidth: '59px'}):store.dispatch(REPLACE,{aSideWidth: '240px'})
          }
        )
      },
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      handle(key, keyPath){

      }
    },
    created(){
      const navIndex = this.$route.name
      store.dispatch(REPLACE, {navIndex: navIndex})
    }
  }
</script>
<style lang="scss">
  @import "../../style/index";
  $image-dashboard: url('../../assets/dashboard.png') center center no-repeat;
  $image-dashboard-hover: url('../../assets/dashboard-hover.png') center center no-repeat;
  $image-bot: url('../../assets/bot.png') center center no-repeat;
  $image-bot-hover: url('../../assets/bot-hover.png') center center no-repeat;
  $image-skill: url('../../assets/skill.png') center center no-repeat;
  $image-skill-hover: url('../../assets/skill-hover.png') center center no-repeat;
  $image-custom: url('../../assets/custom.png') center center no-repeat;
  $image-custom-hover: url('../../assets/custom-hover.png') center center no-repeat;
  $image-opinion: url('../../assets/opinion.png') center center no-repeat;
  $image-opinion-hover: url('../../assets/opinion-hover.png') center center no-repeat;
  $image-authority: url('../../assets/authority.png') center center no-repeat;
  $image-authority-hover: url('../../assets/authority-hover.png') center center no-repeat;

  .el-menu-item.handle-item{
    background-color: $side-transition;
    i{
      color: $primary-color;
    }
  }                     //菜单伸缩按钮
  .el-menu-item.handle-item:hover{
    background-color: $side-transition!important;
    i{
      color: $primary-color;
    }
  }               //保持样式，去除悬浮样式

  .el-menu-item{
    padding-left:$side-item-padding !important;
    padding-right:$side-item-padding;
    color:$side-font-color !important; //侧边栏字体颜色
    font-size: 0;
  }
  .sidebar-container{ //菜单默认样式
    ul{
      height:100%;
      background: $side-background;
    }
  }                               //缩进效果
  .yoy-menu-icon{
    height:$iconH;
    width:$iconW;
    font-size: 26px !important;   //缩进效果
  }
  .side-item-rightRow{
    display:inline-block;
    margin-left: 150px;
    margin-right: -170px!important;
  }
  .el-menu-item{
    height:$side-item-height;
    line-height: $side-item-height;
  }
  .el-menu--collapse{
    width:$side-bar-width;
  }
  .el-tooltip{
    padding:0 $side-item-padding!important;
    /*text-align:center;*/
  }
  .margin-l-15{
    margin-left:15px;
  }
  .yoy-menu-title{
    display: inline-block;
    vertical-align: middle;
  }

  .el-menu-item:hover, .el-menu-item:focus{
    background: $side-background;
  }
  .el-menu-item.is-active{                 //已选中的item，背景色
    background: $primary-color;
    color:$fff !important;
    i{
      color:$fff;
    }
    .yoy-menu-icon{
      background:$image-bot;
    }
  }
  .el-menu-item.is-active:hover{           //已选中的item，去除鼠标悬浮效果
    background: $primary-color;
  }
  .el-menu-item:hover{
    background: $side-hover;
    color:$fff !important; //鼠标划过菜单时字体颜色
    i{
      color:$fff;
    }
  }
  // 控制各个项的选中效果
  .dashboard:hover{
    .yoy-menu-icon{
      background:$image-dashboard-hover;
    }
  }
  .dashboard.is-active .yoy-menu-icon{
    background:$image-dashboard-hover;
  }
  .dashboard{
    .yoy-menu-icon{
      background:$image-dashboard;
    }
  }

  .bot:hover{
    .yoy-menu-icon{
      background:$image-bot-hover;
    }
  }
  .bot.is-active .yoy-menu-icon{
    background:$image-bot-hover;
  }
  .bot{
    .yoy-menu-icon{
      background:$image-bot;
    }
  }
</style>
