<template>
  <section class="">
    <el-menu
      :default-active="navIndex"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      text-color="#cfd9e2"
      active-text-color="#fff"
      :collapse="isCollapse"
      :router="isRouter"
    >
      <el-menu-item index="" class="handle-item text-a-c" @click="show">
        <i class="">展开</i>
      </el-menu-item>
      <el-menu-item index="dashboard">
        <i class="el-icon-menu"></i>
        <span slot="title">
          导航一
          <i class="el-icon-arrow-right side-item-rightRow"></i>
        </span>
      </el-menu-item>
      <el-menu-item index="test">
        <i class="el-icon-menu"></i>
        <span slot="title">
          导航二
          <i class="el-icon-arrow-right side-item-rightRow"></i>
        </span>
      </el-menu-item>
      <el-menu-item index="test1">
        <i class="el-icon-document"></i>
        <span slot="title">
          导航三
          <i class="el-icon-arrow-right side-item-rightRow"></i>
        </span>
      </el-menu-item>
      <el-menu-item index="test3">
        <i class="el-icon-setting"></i>
        <span slot="title">
          导航四
          <i class="el-icon-arrow-right side-item-rightRow"></i>
        </span>
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
        isCollapse: false,
        isRouter: true,
      };
    },
    computed: {
      navIndex () {
        return store.state.app.navIndex
      }
    },
    methods: {
      show(){
        this.isCollapse=!this.isCollapse
      },
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
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
    background: $side-item;
  }
  .sidebar-container{
    ul{
      height:100%;
      background: $side-background;
    }
  }
  .side-item-rightRow{
    margin-left: 70px;
  }
</style>
