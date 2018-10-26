<template>
  <section class="title f-s-16 c555 box-sizing margin-b-30px">
    {{title}}
  </section>

</template>
<script>
  export default {
    name:'titleItem',
    props:{
      title:String,
    },
    data(){
      return{
      }
    }
  }
</script>
<style lang="scss" scoped>
  .title{
    padding-left:10px;
    width: 100%;
    height:36px;
    line-height: 36px;
    background: #f9fafc;
  }
</style>
