<template>
  <section class="app-container full-height">
    <el-container class="full-height el-container">
      <el-header class="full-height nav-b-color el-header nav-height">
        <navBar></navBar>
      </el-header>
      <el-container class="full-height el-container">
        <el-aside :width="aSideWidth" class="full-height el-aside">
          <sidebar class="sidebar-container full-height"></sidebar>
        </el-aside>
        <el-main class="full-height el-main">
          <app-main></app-main>
        </el-main>
      </el-container>
    </el-container>
  </section>
</template>

<script>
  import NavBar from './components/NavBar'
  import Sidebar from './components/Sidebar'
  import AppMain from './components/AppMain'
  import store from '../store/index'

  export default {
    name: 'layout',
    computed:{
      aSideWidth (){
        return store.state.app.aSideWidth
      }
    },
    components: {
      NavBar,
      Sidebar,
      AppMain,
    },
  }
</script>
<style lang="scss">
  @import '../style/index';
  .nav-height{
    height: $nav-height !important; //顶栏高度
  }
</style>
