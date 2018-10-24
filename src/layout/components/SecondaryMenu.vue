<template>
  <el-menu
    default-active="config"
    class=""
    @open="handleOpen"
    @close="handleClose"
    @select="select"
    active-text-color="#2a8ce7"
    style="width: 180px;"
    :default-openeds='openArr'
  >
    <el-menu-item index="0" class="f-s-14" disabled>
      <span slot="title">小华智能助理</span>
    </el-menu-item>
    {{/*基本资料*/}}
    <el-menu-item v-if='!item.children' v-for='item in secondMenus' :index="item.id" class="f-s-14">
      <template slot="title">
        <span>{{item.chineseName}}</span>
        <i class="el-icon-arrow-right"></i>
      </template>
    </el-menu-item>
    <el-submenu v-if="item.children" v-for='item in secondMenus' :index="item.id" class="f-s-14">
      <template slot="title">{{item.chineseName}}</template>
      <el-menu-item v-for='items in item.children' :index="items.id">{{items.chineseName}}</el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>
  import {SECONDMENUS} from "../../constants/constants";
  import {REPLACE} from "../../store/mutations";
  import store from '../../store/index'

  export default {
      data(){
        return{
          openArr:['channel'],
          secondMenus:SECONDMENUS
        }
      },
        name: "SecondaryMenu",
      methods:{
        handleOpen(index,indexPath){
          console.log(index,indexPath)
        },
        handleClose(index,indexPath){
          console.log(index,indexPath)
        },
        select(index,indexPath){
          store.dispatch(REPLACE,{componentName:index})
        }
      }
    }
</script>

<style lang="scss">
  @import '../../style/index';
/*.yoy-second-menu .el-menu-item.is-active{*/
  /*background:#fff;*/
/*}*/

</style>
