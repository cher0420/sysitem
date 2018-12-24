<template>
  <section class="yoy-header-container robotWidth " ref="scrollTop" style="flex:1">
    <bread></bread>
    <section class="yoy-main">
      <router-view></router-view>
    </section>
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
<style scoped>
  .robotWidth {
    width: 100%;

  }
</style>
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
  .yoy-main{
    padding:0 40px 0 40px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    width: calc(100% - 80px);
  }
  .line{
    width: 2px;
    height: 24px;
    line-height: 24px;
    background: $primary-color;
    margin-right: 6px;
  }

</style>
