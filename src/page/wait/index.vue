<template>
  <section>
    <section class="full-width text-a-c margin-b-18">
      <img src="../../assets/wait-logo.png" alt="">
    </section>
    <section class="full-width text-a-c c999">
      <!--<Title title="敬请待"></Title>-->
      页面正在搭建中，敬请期待！
    </section>

    <section class="full-width text-a-c margin-top-70">
      <img src="../../assets/wait.png" alt="">
    </section>
  </section>
</template>
<script>
  import Title from '../../components/Title'
  export default {
    components:{
      Title:Title
    }
  }
</script>
<style lang="scss">
  @import '../../style/index.scss';
  .full-width{
    width:100%;
  }
  .margin-b-18{
    margin-bottom:18px;
  }
  .margin-top-37{
    margin-top:37px;
  }
  .center{
    margin:0 auto;
  }
</style>
