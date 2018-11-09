<template>
  <section class="yoy-bread f-s-14">
    {{/* 以后待更新面包屑 */}}
    <el-breadcrumb separator-class="el-icon-arrow-right" class="single">
      <el-breadcrumb-item class="primary-color align-middle index" to="/bot">首页</el-breadcrumb-item>
      <el-breadcrumb-item class="primary-color align-middle first" :to="breadArr[0].url" @change="handle(breadArr[0].name)">{{breadArr[0].name}}</el-breadcrumb-item>
      <el-breadcrumb-item v-if="breadArr.length===2" class="primary-color align-middle second" @change="handle(breadArr[1].name)">{{breadArr[1].name}}</el-breadcrumb-item>
    </el-breadcrumb>

    {{/* 当有二级面包屑时，采用二级面包屑*/}}
    <el-breadcrumb separator-class="el-icon-arrow-right" class="yoy-title box-sizing border-bottom text-title" v-if="navIndexSecond">
      <el-breadcrumb-item class="align-middle">
        <span class="align-middle dis-i-b line"></span>
        <span @click="back" class="backHover">
          {{navIndex}}
        </span>
      </el-breadcrumb-item>
      <el-breadcrumb-item class="align-middle">
        {{navIndexSecond}}
      </el-breadcrumb-item>
    </el-breadcrumb>

    <section class="yoy-title box-sizing border-bottom text-title" v-else>
      <span class="align-middle dis-i-b line"></span>
      <span class="align-middle">
        {{navIndex}}
      </span>
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
        underStyle:'none'
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
      const navIndex = arr[arr.length-1]
      store.dispatch(REPLACE,{navIndex})
    },
    methods:{
      handle(name){
        store.dispatch(REPLACE,{navIndex:name}).then(
          () =>{

          }
        )
      },
      back(){
        const url={
          path: this.$route.path,
        }
        this.$router.back()
      },
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
  .yoy-bread .el-breadcrumb.single{
    font-family: 宋体;
    font-size: 14px;
    color: #777;
    height: $bread-height;
    line-height: $bread-height;
    padding-right: 40px;
    span:hover{
      /*text-decoration: underline;*/
    }
    .second{
      span:hover{
        text-decoration: none;
        cursor: not-allowed;
      }
    }
    .first,.index{
      span:hover{
        text-decoration: underline;
      }
    }
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
