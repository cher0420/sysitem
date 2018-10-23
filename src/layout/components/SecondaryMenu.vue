<template>
  <el-menu
    default-active="1"
    class=""
    @open="handleOpen"
    @close="handleClose"
    active-text-color="#2a8ce7"
    style="width: 180px;"
    :default-openeds='openArr'
  >
    <el-menu-item index="0" class="f-s-14" disabled>
      <span slot="title">小华智能助理</span>
    </el-menu-item>
    {{/*基本资料*/}}
    <el-menu-item index="1" class="f-s-14">
      <template slot="title">
        <span>基本资料</span>
        <i class="el-icon-arrow-right"></i>
      </template>
    </el-menu-item>
    <el-submenu index="2" class="f-s-14">
      <template slot="title">渠道配置</template>
      <el-menu-item index="2-1">网页</el-menu-item>
      <el-menu-item index="2-2">微信服务号</el-menu-item>
      <el-menu-item index="2-3">微信企业号</el-menu-item>
      <el-menu-item index="2-4">实体机器人</el-menu-item>
      <el-menu-item index="2-5">桌面应用</el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>
    export default {
      data(){
        return{
          openArr:['1','2']
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
      }
    }
</script>

<style lang="scss">
  @import '../../style/index';
/*.yoy-second-menu .el-menu-item.is-active{*/
  /*background:#fff;*/
/*}*/

</style>
