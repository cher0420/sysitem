<template>
  <section class="app-container full-height">
    <el-container class="full-height el-container">
      <el-header class="full-height nav-b-color el-header nav-height">
        <navBar></navBar>
      </el-header>
      <el-container class="full-height el-container">
        <el-aside v-if='isCollapse' class="el-aside full-height" width='60px' :style="{float:'left',minWidth:'60px',maxWidth: '280px'}">
            <sidebar class="sidebar-container full-height"></sidebar>
        </el-aside>
        <el-aside v-else class="el-aside full-height" width='14vw' :style="{float:'left',maxWidth: '280px'}">
          <sidebar class="sidebar-container full-height"></sidebar>
        </el-aside>
        <el-container class="full-height">
          <section v-if="config">
            <secondary-menu  class="yoy-second-menu full-height">
            </secondary-menu>
          </section>
          <el-container class="" v-loading="mainLoading">
            <el-main class="p-relative scroll-content">
              <app-main></app-main>
            </el-main>
            <el-footer style="height:65px;">
              <footer-bar></footer-bar>
            </el-footer>
          </el-container>
        </el-container>
      </el-container>
    </el-container>
  </section>
</template>

<script>
  import NavBar from './components/NavBar'
  import Sidebar from './components/Sidebar'
  import AppMain from './components/AppMain'
  import FooterBar from './components/Footer'
  import SecondaryMenu from './components/SecondaryMenu'
  import store from '../store/index'
  import {REPLACE} from "../store/mutations";

  export default {
    name: 'layout',
    data(){
      return{

      }
    },
    computed:{
      mainLoading(){
        return store.state.app.mainLoading
      },
      config() {
        return store.state.app.config
      },
      aSideWidth (){
        return store.state.app.aSideWidth
      },
      isCollapse () {
        return store.state.app.isCollapse
      },
    },
    beforeCreate(){
      const config = this.$route.name ==='config' //判断路由是否为配置二级菜单，是则为true，不是则false并隐藏二级菜单
      store.dispatch(REPLACE,{config})
    },
    components: {
      NavBar,
      Sidebar,
      AppMain,
      FooterBar,
      SecondaryMenu
    },
  }
</script>
<style lang="scss">
  @import '../style/index';
  .nav-height{
    height: $nav-height !important; //顶栏高度
  }
  .app-container{
    min-width: 1280px;
    min-height: 560px;
  }
  .el-main{
    /*margin-left: 180px;*/
    /*min-height: 80vh;*/
    box-sizing: border-box;

  }
  .yoy-footer{
    bottom:0;
    left:50%;
    transform: translateX(-50%);
  }

  /*
  二级菜单
   */

</style>
