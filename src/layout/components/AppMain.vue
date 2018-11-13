<template>
  <section class="p-relative yoy-header-container" ref="scrollTop">
    <bread></bread>
    <router-view></router-view>
  </section>
</template>
<script>
  import Bread from './Bread'
  import store from '../../store/index'
  export default {
    data() {
      return {

      }
    },
    components:{
      Bread
    },
    computed: {

    },
    watch: {
      '$route'(to, from) {
        if(to&&from)
        this.scrollTop()
      }
    },
    created() {

    },
    methods: {
      regUrl() {

      },
      scrollTop(){
        this.$refs.scrollTop.offsetParent.scrollTop = 0
      },
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
    /*padding-top: 48px;*/
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
    padding-right: 40px;
  }
  .yoy-main{
    padding:0 40px 0 40px;
  }
  .line{
    width: 2px;
    height: 24px;
    line-height: 24px;
    background: $primary-color;
    margin-right: 6px;
  }

</style>
