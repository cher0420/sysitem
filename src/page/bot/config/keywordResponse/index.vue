<template>
  <div class="p-relative">
    <div class="f-l done">
      <el-input class='searchInput middle' size = 'small' v-model="keyWords" placeholder="关键词搜索" @keyup.enter.native="search"><i slot="suffix" class="el-input__icon el-icon-search yoy-search-button" @click="search"></i>
      </el-input><el-button type="primary" class="middle margin-left-20 big-button">添加关键词</el-button><el-button type="primary" class="middle big-button" >导入关键词</el-button><span class="primary-color download margin-left-20" @click="download">下载导入模版</span>
    </div>
    <section>

      <el-button  v-show='status' type="primary" class="big-button" @click="dumpAll">清空数据</el-button>

      <el-button  v-show='status' type="danger" class=" stop" @click="closedIt">停用</el-button>
      <el-button  v-show='!status' type="primary" @click="openIt">开启</el-button>


    </section>

  </div>
</template>
<script>
  export default {
    data() {
      return {
        doingStatus: false,
        keyWords: '',
        status: true
      }
    },
    computed: {

    },
    methods: {
      download () {
        this.keyWords = 'yoyo'
        console.log('下载的')
      },
      dumpAll () {
        console.log('删除全部')
      },
      search() {
        console.log('搜索')
      },
      openIt () {
        this.status = true
      },
      closedIt(v) {
        this.status = false
      }
    }
  }
</script>
<style scoped lang="scss">
  @import "../../../../style/index.scss";

  .middle{
    vertical-align: middle;
  }
  .margin-left-20{
    margin-left: 20px;
  }
  .download{
    cursor: pointer;
  }
  .download:hover{
    opacity: 0.8;
    text-decoration: underline;
  }
  .f-l{
    float: left;
  }
  .f-r{
    float: right;
  }
  /*component*/
  .done {
    margin-bottom: 20px;
  }
  .transition{
      transition: margin 1s;
  }
  /*do some thing*/
  .hover:hover {
    text-decoration: underline;
    cursor: pointer;
  }
  .edit:hover {
    color: $primary-color;
  }
  .delete{
    background: $danger;
    color: $fff;
  }
  .delete:hover {
    color: $danger;
    background: $fff;
  }
  .stop{
    background: $danger;
    color: $fff;
  }
  .stop:hover{
    background: $fff;
    color: $danger;
  }
  .has-stop{
    position: absolute;
    right: 0;
  }
  .do{
    text-align: right;
    margin-right: -100px;
  }
</style>
