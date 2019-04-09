<template>
  <section class="yoy-bread f-s-14">
    {{/* 以后待更新面包屑 */}}
    <el-breadcrumb separator-class="el-icon-arrow-right" class="single">

      <el-breadcrumb-item class="primary-color align-middle index" to="/bot">首页</el-breadcrumb-item>

      <el-breadcrumb-item
        v-for="(item,index) in breadArr"
        :class="index===breadArr.length-1?'notAllow':'first'"
        :to="index===breadArr.length-1?null:item.url"
        :key="index"
        style="height: 100%;"
      >
        <span :class="index===breadArr.length-1?['text-overflow-hidden']:['']">
          {{item.name}}
        </span>
      </el-breadcrumb-item>

    </el-breadcrumb>
  </section>
</template>
<script>
  import store from '../../store/index'

  export default {
    data(){
      return{
      }
    },
    computed: {

      breadArr(){
        return store.state.app.breadArr
      },
    },
    created(){
      // //判断面包屑初始化时是否为详情页
      // const to = this.$route
      // const arr = to.path.split('/')
      // const last = to.name === 'detail'
      //
      // if(last){
      //   const navIndex = to.query.title
      //   store.dispatch(REPLACE,{navIndex})
      // }else{
      //   const navIndex = STR[arr[arr.length-1]]
      //   store.dispatch(REPLACE,{navIndex})
      // }
    },
    methods:{

      back(){
        this.$router.back()
      },
    }
  }
</script>
<style lang="scss">
  @import '../../style/index';
  @import '../../style/var/color';
  $bread-background: #2a8ce7;
  $bread-height: 48px;
  $title-height: 65px;
  .primary-color{
    color: $primary-color;
  }
  .backHover{
    cursor: pointer;
  }
  .backHover:hover{
    color:$primary-color;
  }
  .align-middle{
    vertical-align: middle;
  }
  .line{
    display: inline-block;
    width:2px;
    height:24px;
    background-color: $primary-color;
    margin-right: 6px;
  }
  .yoy-bread .el-breadcrumb.single{
    font-size: 14px;
    color: #777;
    height: $bread-height;
    line-height: $bread-height;
    padding-right: 40px;
    padding-left: 40px;
    background: #f8f8f8;

    span:hover{
      /*text-decoration: underline;*/
    }
    .second,.notAllow{
      span:hover{
        text-decoration: none;
        cursor: default;
      }
    }
    .first,.index{
      span:hover{
        text-decoration: underline;
      }
    }
    .notAllow{
      span:hover{
        text-decoration: none;
        cursor: default;
      }
    }
  }
  .yoy-bread {
    .el-breadcrumb.yoy-title{
      height: $title-height;
      line-height: $title-height;
      padding-left: 0;
    }
  }
  .text-overflow-hidden{
    /*span{*/
      display: inline-block;
      width: 300px;
      overflow: hidden;
      height: 100%;
      text-overflow: ellipsis;
      white-space: nowrap;
    /*}*/

  }

</style>
