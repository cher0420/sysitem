<template>
  <section class="p-relative">
    <section class="margin-top-30">
      <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: item.url }" v-for="item in breadArr"><span class="dis-i-b line align-middle"></span><span class="text-title align-middle">{{item.name}}</span></el-breadcrumb-item>
    </el-breadcrumb>
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
      }
    },
    watch: {
      '$route'(to, from) {
        // console.log(this.$route)
      }
    },
    created() {
    },
    methods: {
      regUrl() {

      }
    }
  }
</script>
<style lang="scss">
  @import '../../style/index';
  .margin-top-30{
    margin-bottom: 30px;
  }
  .align-middle{
    vertical-align: middle;
  }
  .line{
    width:2px;
    height:20px;
    background-color: $primary-color;
    margin-right: 6px;
  }
</style>
