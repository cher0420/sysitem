<template>
  <section class="p-relative yoy-header-container">
    <section class="yoy-bread f-s-14">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item class="primary-color align-middle" :to="{ path: item.url }" v-for="item in breadArr">{{item.name}}</el-breadcrumb-item>
        </el-breadcrumb>
      <section class="yoy-title box-sizing border-bottom text-title"><span class="align-middle dis-i-b line"></span><span class="align-middle">基本资料</span></section>
    </section>
    <router-view></router-view>
  </section>
</template>
<script>
  import store from '../../store/index';

  export default {
    data() {
      return {

      }
    },
    computed: {
      breadArr(){
        return store.state.app.breadArr
      },
    },
    watch: {
      '$route'(to, from) {
      }
    },
    created() {
      console.log(this.$route)
    },
    methods: {
      regUrl() {

      }
    }
  }
</script>
<style lang="scss">
  @import '../../style/index';
  $bread-background: #2a8ce7;
  $bread-height: 48px;
  $title-height: 65px;
  .align-middle{
    vertical-align: middle;
  }
  .line{
    width:2px;
    height:20px;
    background-color: $primary-color;
    margin-right: 6px;
  }

  .yoy-header-container{
    .yoy-bread{

    }
  }
  .yoy-bread .el-breadcrumb{
    height: $bread-height;
    line-height: $bread-height;
    padding-left: 40px;
    padding-right: 40px;
  }
  .yoy-title{
    height: $title-height;
    line-height: $title-height;
    padding-top: 10px;
    padding-left: 40px;
    padding-right: 40px;
  }
  .yoy-main{
    padding:30px 40px 40px 40px;
  }
  .line{
    width: 2px;
    height: 24px;
    line-height: 24px;
    background: $primary-color;
    margin-right: 6px;
  }

</style>
