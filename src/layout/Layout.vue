<template>
  <section class="app-container full-height">
    <el-container class="full-height el-container">
      <el-header class="full-height nav-b-color el-header nav-height">
        <navBar></navBar>
      </el-header>
      <el-container class="full-height el-container">
        <el-aside :width="aSideWidth" class="full-height el-aside" style="float:left">
          <sidebar class="sidebar-container full-height"></sidebar>
        </el-aside>
        <el-container class="full-width">
          <secondary-menu class="yoy-second-menu" :style="{'display': config? 'block':'none'}">
          </secondary-menu>
          <el-container>
            <el-main class="p-relative full-height" style="float: left">
              <app-main></app-main>
            </el-main>
            <el-footer style="height:64px;" class="">
              <footer-bar></footer-bar>
            </el-footer>
          </el-container>
          <!--<section v-if='config' class="yoy-second-menu" style="float: left">-->
            <!--<secondary-menu v-if='config' class="yoy-second-menu" style="float: left">-->
            <!--</secondary-menu>-->
          <!--</section>-->
          <!--<section class="p-relative full-width" style="float: left">-->
          <!--</section>-->
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
      config() {
        return store.state.app.config
      },
      aSideWidth (){
        return store.state.app.aSideWidth
      }
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
    min-width: 1440px;
    /*min-height: 800px;*/
  }
  .el-main{
    /*margin-left: 180px;*/
    min-height: 80vh;
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
