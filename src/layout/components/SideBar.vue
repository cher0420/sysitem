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
        <i class="yoy-menu-icon"></i>
      </el-menu-item>
      <el-menu-item :index="item.id" v-for="item in menus">
        <p class="p-absolute">
          <i class="p-absolute yoy-menu-icon dis-i-b yoy-icon1" :style="{background: 'url(' + require(`../../assets/${item.id}.png`) + ')center center no-repeat'}"></i>
          <i class="p-absolute yoy-menu-icon dis-i-b yoy-icon2" :style="{background: 'url(' + require(`../../assets/${item.id}-hover.png`) + ')center center no-repeat'}"></i>
        </p>
        <i v-show="!isCollapse" class="el-icon-arrow-right f-s-14 side-item-rightRow"></i>
        <span class="f-s-14 yoy-menu-title p-relative margin-l-47" slot="title">{{item.chineseName}}</span>
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

  .el-menu-item.handle-item{
    background-color: $side-transition;
    i{
      color: $primary-color;
    }
    .yoy-menu-icon{
      display: inline-block;
      height: $iconH;
      width: $iconW;
      background: url("../../assets/menu.png") center center no-repeat;
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
    height:$side-item-height !important;
    line-height: $side-item-height !important;
  }
  .el-menu--collapse{
    width:$side-bar-width;
  }
  .el-tooltip{
    padding:0 $side-item-padding!important;
    /*text-align:center;*/
  }
  .margin-l-47{
    margin-left:47px;
  }
  .yoy-menu-title{
    display: inline-block;
    vertical-align: middle;
  }

  .el-menu-item:hover, .el-menu-item:focus{
    background: $side-background !important;
  }
  .el-menu-item.is-active{                 //已选中的item，背景色
    background: $primary-color !important;
    color:$fff !important;
    i{
      color:$fff;
    }
    .yoy-icon1{
      display: none;
    }
  }
  .el-menu-item.is-active:hover{           //已选中的item，去除鼠标悬浮效果
    background: $primary-color !important;
  }
  .el-menu-item:hover{
    background: $side-hover !important;
    color:$fff !important; //鼠标划过菜单时字体颜色
    i{
      color:$fff;
    }
    .yoy-icon1{
      display: none;
    }
  }
  // 控制各个项的选中效果
  .yoy-icon1,.yoy-icon2{
    top:0;
    left:0;
    margin-top: $iconH/2-3;
    width:$iconW;
    height:$iconH;
    z-index: 0;
  }
  .yoy-icon1{
    z-index: 2;
  }
</style>
