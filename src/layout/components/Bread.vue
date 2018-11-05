<template>
  <section class="yoy-bread f-s-14">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item class="primary-color align-middle" to="/bot">首页</el-breadcrumb-item>
      <el-breadcrumb-item class="primary-color align-middle" :to="{ path: item.url }" v-for="item in breadArr" @change="handle(item.name)">{{item.name}}</el-breadcrumb-item>
    </el-breadcrumb>

    <el-breadcrumb separator-class="el-icon-arrow-right" class="yoy-title box-sizing border-bottom text-title"  v-if="navIndexSecond">
      <el-breadcrumb-item class="align-middle">
        <span class="align-middle dis-i-b line"></span>
        <span @click="back" class="backHover">
          {{navIndex}}
        </span>
      </el-breadcrumb-item>
      <el-breadcrumb-item class="align-middle" v-if="navIndexSecond">
        {{navIndexSecond}}
      </el-breadcrumb-item>
    </el-breadcrumb>

    <section class="yoy-title box-sizing border-bottom text-title" v-else>
      <span class="align-middle dis-i-b line"></span>
      <span class="align-middle">
        {{navIndex}}
      </span>
      <!--<span class="align-middle" v-if="navIndexSecond">-->
        <!--<span class="el-icon-arrow-right">{{navIndexSecond}}</span>-->
      <!--</span>-->
    </section>



  </section>
</template>
<script>
  import store from '../../store/index'
  import {STR} from "../../constants/constants";
  import {REPLACE} from "../../store/mutations";

  export default {
    data(){
      return{
      }
    },
    computed: {
      breadArr(){
        return store.state.app.breadArr
      },
      navIndex(){
        const index=store.state.app.navIndex
        return STR[index]
      },
      navIndexSecond(){
        return store.state.app.navIndexSecond
      }
    },
    created(){
      const arr = this.$route.path.split('/')
      const index = arr[arr.length-1]
      store.dispatch(REPLACE,{navIndex:index}).then(
        () =>{

        }
      )
    },
    methods:{
      handle(name){
        store.dispatch(REPLACE,{navIndex:name}).then(
          () =>{

          }
        )
      },
      back(){
        store.dispatch(REPLACE,{componentName:'knowledgeQuiz'})
      }
    }
  }
</script>
<style lang="scss">
  @import '../../style/index';
  $bread-background: #2a8ce7;
  $bread-height: 48px;
  $title-height: 65px;
  .backHover{
    cursor: pointer;
  }
  .backHover:hover{
    /*color:*/
    color:$primary-color;
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
  .yoy-bread{
    margin-bottom: 30px;
  }
  .yoy-bread .el-breadcrumb{
    height: $bread-height;
    line-height: $bread-height;
    padding-right: 40px;
  }
  .yoy-title{
    height: $title-height;
    line-height: $title-height;
    padding-top: 10px;
    margin-left: 40px;
    margin-right: 40px;
  }
  .line{
    width: 2px;
    height: 24px;
    line-height: 24px;
    background: $primary-color;
    margin-right: 6px;
  }
  .yoy-bread {
    .el-breadcrumb.yoy-title{
      height: $title-height;
      line-height: $title-height;
      padding-left: 0;
    }
  }

</style>
