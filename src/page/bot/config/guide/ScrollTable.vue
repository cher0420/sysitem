<template>
  <section class="scroll-container">
      <section v-for="(item, index) in tableData" :key="item.id" :class="index%2 !== 0?['even']:'odd'">
      <span class="checked-box-container">
        <el-checkbox :value="item.checked" v-model="item.checked" size="medium" class="checked-box-container" @change="checkBox"></el-checkbox>
      </span>
        <section class="title">{{item.name}}</section>
      </section>
      <section class="loading-container primary-color">
        <i class="el-icon-loading"></i>
        正在加载中...
      </section>
  </section>
</template>
<script>
  export default {
    data(){
      return{
        tableData: [
          {
            name: '居住证',
            checked: true
          },
          {
            name: '居住证',
            checked: true
          },
          {
            name: '居住证',
            checked: true
          },
          {
            name: '居住证',
            checked: true
          },
          {
            name: '居住证',
            checked: true
          },
          {
            name: '居住证',
            checked: true
          },
          {
            name: '居住证',
            checked: true
          },
          {
            name: '居住证',
            checked: true
          },
          {
            name: '居住证',
            checked: true
          },
          {
            name: '居住证',
            checked: true
          },

        ]
      }
    },
    methods: {
      checkBox(v) {
        if(v){
          this.$emit('computedTotal', 1)
        }else{
          this.$emit('computedTotal', -1)
        }
      }
    }
  }
</script>
<style scoped lang="scss">
  @import "../../../../style/index";
  .scroll-container{
    width: 100%;
    height: 400px;
    border: 1px solid $border-color;
    overflow: scroll;
    .even{
      background: #f9fafc;
    }
    section{
      height: 40px;
      line-height: 40px;
    }
    .title{
      display: inline-block;
      padding-left: 18px;
      width: 60%;
      height: 40px;
      line-height: 40px;
      overflow-x: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
      vertical-align: top;
    }
    .loading-container{
      width: 100%;
      height: 40px;
      line-height: 40px;
      text-align: center;
    }
  }
  .checked-box-container{
    display: inline-block;
    height: 40px;
    line-height: 40px;
    width: 40px;
    text-align: center;
    border-right: 1px solid #edf4fc;
    vertical-align: top;
  }


</style>
