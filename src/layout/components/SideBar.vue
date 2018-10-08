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
        <i class="f-s-14 el-icon-more"></i>
      </el-menu-item>
      <el-menu-item :index="item.id" v-for="item in menus">
        <i class="el-icon-menu yoy-menu-icon"></i>
        <i v-show="!isCollapse" class="el-icon-arrow-right f-s-14 side-item-rightRow"></i>
        <span class="f-s-14 yoy-menu-title p-relative margin-l-15" slot="title">{{item.chineseName}}</span>
      </el-menu-item>
    </el-menu>
  </section>
</template>
<script>
  import store from '../../store/index'
  import {REPLACE} from "../../store/mutations";
  import {MENUS} from "../../constants/constants";

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
    background-color: $side-background;
  }
  .el-menu-item:hover, .el-menu-item:focus{
    background-color: $side-item;
  }
  .el-menu-item.is-active{
    background: $primary-color;
  }
  .el-menu-item:hover{
    background: $primary-color;
  }

  .el-menu-item:hover.el-menu-item.handle-item{
    background: $side-background;
    i{
      color:$primary-color;
    }
  }
  .el-menu-item{
    padding-left:$side-item-padding !important;
    padding-right:$side-item-padding;
    background: $side-item;
    color:$side-font-color !important; //侧边栏字体颜色
    font-size: 0;
  }
  .sidebar-container{
    ul{
      height:100%;
      background: $side-background;
    }
  }
  .yoy-menu-icon{
    font-size: 26px !important;
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
</style>
