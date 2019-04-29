<template>
  <section class="p-relative ">
    <section class="p-absolute left-0 f-s-14 yoy-logo">
    </section>
    <section class="p-absolute right-0 yoy-intro">
      <section>
        <el-dropdown class="f-s-14" @command="handleClick" trigger="click" placement="top-start">
          <span class="el-dropdown-link">
            {{userName}}<i class="el-icon-caret-bottom el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown" class='yoy-nav' style="width: 120px;background: #365172;border-radius: 1px;margin-top: 1px;padding:0">
            <el-dropdown-item class="f-s-14 font-primary" :style="{color:'#fff',background: hoverBackground}" ><section @mouseenter="changeBackground('#2d4460')" @mouseout="changeBackground('#365172')">注销</section></el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <!--<span class="dis-i-b">English</span>-->
      </section>
    </section>
  </section>
</template>
<script>
  import store from '../../store/index'
  import {logOut} from '../../permissions/permissions'
  export default {
    data(){
      return{
        hoverBackground: '#365172'
      }
    },
    computed:{
      userName(){
        return store.state.app.userName
      }
    },
    methods: {
      handleClick() {
        logOut()
      },
      changeBackground(v){
        this.hoverBackground = v
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import '../../style/index';
  @import '../../style/var/color';
  @import '../../style/var/size';
  $rightEH:60px;
  $rightEW:155px;
  .font-primary{
    color: $primary-color;
  }
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
    background-size:cover;
  }
  // 覆盖原有组件样式
  .el-header{
    padding:0 0 !important;
  }
  .yoy-intro .el-dropdown{
    color:$fff;
    line-height: $rightEH;
    cursor: pointer;
    /*padding: 0 15px;*/
    display: inline-block;
    width: 100%;
    height: 100%;
    span{
      display: inline-block;
      width: 100%;
      height: 100%;
      padding: 0 15px;
      box-sizing: border-box;
    }
  }
  .yoy-intro .el-dropdown:hover{
    background: #2d4460;
  }
  .yoy-intro{
    margin-right:100px;
  }
</style>
