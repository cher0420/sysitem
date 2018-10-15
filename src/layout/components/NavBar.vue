<template>
  <section class="p-relative f-s-0">
    <section class="p-absolute left-0 f-s-14 yoy-logo">
    </section>
    <section class="p-absolute right-0 yoy-intro">
      <section>
        <el-dropdown class="f-s-14">
          <span class="el-dropdown-link" trigger="click">
            {{userName}}<i class="el-icon-caret-bottom el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item class="f-s-14 font-primary">注销</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <!--<span class="dis-i-b">English</span>-->
      </section>
    </section>
  </section>
</template>
<script>
  import store from '../../store/index'
  export default {
    computed:{
      userName(){
        return store.state.app.userName
      }
    }
  }
</script>
<style lang="scss">
  @import '../../style/index';
  $rightEH:20px;
  $rightEW:155px;


  .left-0{
    left:0;
  }
  .right-0{
    right:0;
  }
  .yoy-E {
    width: $rightEW;
  }
  .yoy-logo{
    width:$side-width;
    height:$nav-height;
    background: url("../../assets/logo.png") center center no-repeat;
  }
  // 覆盖原有组件样式
  .el-header{
    padding:0 0 !important;
  }
  .yoy-intro .el-dropdown{
    color:$fff;
    height:$rightEH;
    line-height: $rightEH;
    margin-top: 22px;
  }
  .yoy-intro{
    margin-right:60px;
  }
</style>
