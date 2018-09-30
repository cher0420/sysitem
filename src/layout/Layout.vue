<template>
  <section class="app-container full-height">
    <el-container class="full-height el-container">
      <el-header class="full-height nav-b-color el-header">
        <navBar></navBar>
      </el-header>
      <el-container class="full-height el-container">
        <el-aside width="200px" class="full-height el-aside">
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

  export default {
    name: 'layout',
    components: {
      NavBar,
      Sidebar,
      AppMain,
    },
  }
</script>
<style lang="scss">
  @import '../style/index';
</style>
