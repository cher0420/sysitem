<template>
  <section class="">
    <el-menu
      :default-active="navIndex"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      @select="handle"
      text-color="#cfd9e2"
      active-text-color="#fff"
      :collapse="isCollapse"
      :router="isRouter"
    >
      <el-menu-item index="show" class="handle-item text-a-c" @click="show">
        <i class="yoy-menu-icon"></i>
      </el-menu-item>

      <el-menu-item :index="item.id" v-for="item in menus">
        <p class="p-absolute">
          <i class="p-absolute yoy-menu-icon dis-i-b yoy-icon1" :style="{background: 'url(' + require(`../../assets/${item.id}.png`) + ')center center no-repeat'}"></i>
          <i class="p-absolute yoy-menu-icon dis-i-b yoy-icon2" :style="{background: 'url(' + require(`../../assets/${item.id}-hover.png`) + ')center center no-repeat'}"></i>
        </p>
        <i v-show="!isCollapse" class="el-icon-arrow-right f-s-14 side-item-rightRow"></i>
        <span class="f-s-14 p-relative" slot="title">
          {{item.chineseName}}
        </span>
      </el-menu-item>
    </el-menu>
  </section>
</template>
<script>
  import store from '../../store/index'
  import {REPLACE} from "../../store/mutations";
  import {STR} from "../../constants/constants";
  import {MENUS} from "../../constants/constants";

  export default {
    data() {
      return {
        isRouter: true,
        menus:MENUS
      };
    },
    computed: {
      navIndex () {
        return store.state.app.navIndex
      },
      isCollapse () {
        return store.state.app.isCollapse
      }
    },
    watch: {
      '$route' (to, from) {
        if(to&&from){
          store.dispatch(REPLACE,{mainLoading: true}).then(
            () =>{
              const arr = this.$route.path.split('/')
              const pathArr = arr.splice(1,arr.length-1)
              const newArr = []
              const navEnd = pathArr[pathArr.length-1]
              for(let v of pathArr){
                const url = '/'+v
                const name = STR[v]
                const obj = {
                  url, name
                }
                newArr.push(obj)
              }
              // 进入配置二级菜单页面
              const config = navEnd === 'config'
              const name = to.name
              store.dispatch(REPLACE,{breadArr:newArr,config,navIndex:name}).then(
                () => {
                  setTimeout(
                    () =>{
                      store.dispatch(REPLACE,{mainLoading:false})
                    },300
                  )
                }
              )
            }
          )

        }else{
          this.$router.push('/dashboard')
        }

      }
    },
    methods: {
      show(){
        store.dispatch(REPLACE, {isCollapse: !this.isCollapse}).then(
          ()=>{
            this.isCollapse?store.dispatch(REPLACE,{aSideWidth: '60px'}):store.dispatch(REPLACE,{aSideWidth: '240px'})
          }
        )
      },
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      handle(key, keyPath){
        if(key){
          window.location.hash=key
          const url = key
          const name = STR[key]
          const obj = {
            url,name
          }
          const arr=[obj]
          store.commit(REPLACE,{breadArr:arr})
          store.dispatch(REPLACE, {defaultActiveSecondM: 'config'})
          this.$router.push(key)
          window.location.hash = '#/'+key
        }
        }
    },
    created(){
      const arr = this.$route.path.split('/')
      const pathArr = arr.splice(1,arr.length-1)
      const newArr = []
      const navIndex = pathArr[0]
      for(let v of pathArr){
        const url = '/'+v
        const name = STR[v]
        const obj = {
          url, name
        }
        newArr.push(obj)
      }
      store.dispatch(REPLACE,{navIndex:navIndex,breadArr:newArr})
    }
  }
</script>
<style lang="scss">
  @import "../../style/index";

  .sidebar-container{ //菜单默认样式
    ul{
      height:100%;
      background: $side-background;
    }
  }                               //缩进效果
  .yoy-menu-icon{
    height:$iconH;
    width:$iconW;
    font-size: 26px !important;   //缩进效果
  }

  .el-tooltip{
    padding:0 $side-item-padding!important;
    /*text-align:center;*/
  }
  .margin-l-159{
    margin-left:-159px;
  }
  // 控制各个项的选中效果
  .yoy-icon1,.yoy-icon2{
    top:0;
    left:0;
    margin-top: $iconH/2-3;
    width:$iconW;
    height:$iconH;
    z-index: 0;
  }
  .yoy-icon1{
    z-index: 2;
  }
</style>
