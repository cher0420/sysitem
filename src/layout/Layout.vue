<template>
  <section class="app-container full-height">
    <el-container class="full-height el-container robotFull">
      <el-header class="full-height nav-b-color el-header nav-height robotHeader">
        <navBar></navBar>
      </el-header>
      <div class="full-height el-container">
        <!-- menu -->
        <el-aside  v-if='isCollapse' class="el-aside full-height" width='60px'
                  :style="{float:'left',minWidth:'60px',maxWidth: '240px'}">
          <sidebar class="sidebar-container full-height"></sidebar>
        </el-aside>
        <el-aside v-else class="el-aside full-height" width='14vw' :style="{float:'left',maxWidth: '240px'}">
          <sidebar class="sidebar-container full-height"></sidebar>
        </el-aside>
        <!-- display area -->
           <!-- second -->
        <el-container class="full-height robotDisplayArea" style="position:static;width: 80vw;">
          <section v-if="config">
            <secondary-menu class="yoy-second-menu full-height">
            </secondary-menu>
          </section>
           <!-- main -->
          <el-container v-loading="mainLoading" :element-loading-text="loadingText" class="full-width robotDetail" style="position:relative;width: 70vw;">
            <el-main class="full-width">
              <app-main></app-main>
            </el-main>
          </el-container>

        </el-container>
      </div>
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
    data() {
      return {}
    },
    computed: {
      mainLoading() {
        return store.state.app.mainLoading
      },
      config() {
        return store.state.app.config
      },
      aSideWidth() {
        return store.state.app.aSideWidth
      },
      isCollapse() {
        return store.state.app.isCollapse
      },
      loadingText(){
        return store.state.app.loadingText
      }
    },
    beforeCreate() {
      const config = this.$route.name === 'config' //判断路由是否为配置二级菜单，是则为true，不是则false并隐藏二级菜单
      store.dispatch(REPLACE, {config})
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
<style lang="scss" scoped>
  .robotFoot {
    /*position: absolute;*/
    /*left: 0;*/
    /*bottom: 0;*/
    /*width: 100%;*/
    /*background: #fff;*/
  }

  .robotDisplayArea {
    height: 100%;
    width: 100%;
  }

  .robotFull {
    position: relative;
    padding-top: 60px;
  }

  .robotHeader {
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 0;
  }

  .robotDetail {
    /*padding-bottom: 60px;*/
    height: 100%;
    /*min-height:calc(100% - 60px);*/
    /*width: 100%;*/
    /*overflow: scroll;*/
  }
</style>
<style lang="scss">
  @import '../style/index';

  .nav-height {
    line-height: $nav-height;
  }

  .app-container {
    min-width: 1280px;
    min-height: 560px;
  }

  .el-main {
    /*padding-bottom: 130px;*/
    /*box-sizing: border-box;*/
  }

  .yoy-footer {
    width: 100%;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    background: #fff;
  }

  /*
  二级菜单
   */

</style>
