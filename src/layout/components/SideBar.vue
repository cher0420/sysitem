<template>
  <section>
    <section index="" class="handle-item text-a-c" @click="show">
      <i class="yoy-menu-icon"></i>
    </section>
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
      <el-menu-item :index="item.id" v-for="item in menus">
        <p class="p-relative iconContainer" style="">
          <i class="p-absolute yoy-menu-icon dis-i-b yoy-icon1" :style="{background: 'url(' + require(`../../assets/${item.id}.png`) + ')center center no-repeat'}"></i>
          <i class="p-absolute yoy-menu-icon dis-i-b yoy-icon2" :style="{background: 'url(' + require(`../../assets/${item.id}-hover.png`) + ')center center no-repeat'}"></i>
        </p>
        <template slot="title">
          <span class="f-s-14 dis-i-b align-middle side-menu-text p-relative" slot="title">
          {{item.chineseName}}
            <i v-if="!isCollapse" class="el-icon-arrow-right f-s-14 side-item-rightRow" style="vertical-align: middle"></i>
        </span>
        </template>
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
      },
      aSideWidth (){
        return store.state.app.aSideWidth
      }
    },
    watch: {
      '$route' (to, from) {
        const that = this
        if(to&&from){
          store.dispatch(REPLACE,{mainLoading: true,}).then(
            () =>{
              // 面包屑，带优化
              this.setBreadArr(to)
              // 进入配置二级菜单页面
              const navIndexArr = to.path.split('/')
              const navIndex = navIndexArr[navIndexArr.length-1]
              const config = to.name === 'config'
              let aSideWidth = null;
              if(to.name === 'config'){
                aSideWidth = '60px !important'
                if(that.isCollapse === false){
                  store.dispatch(REPLACE,{isCollapse:true})
                }
              }else{
                aSideWidth = '14vw'
                store.dispatch(REPLACE,{isCollapse:false})
              }
              store.dispatch(REPLACE,{config,navIndex,aSideWidth}).then(
                () => {
                  setTimeout(
                    () =>{
                      store.dispatch(REPLACE,{mainLoading:false})
                    },500
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
      // leaveMouse(){
      //   store.dispatch(
      //     REPLACE,{isCollapse:true,aSideWidth: '60px !important'}
      //   )
      // },
      // enterMouse(){
      //   store.dispatch(
      //     REPLACE,{isCollapse:false,aSideWidth: '14vw'}
      //   )
      // },
      setBreadArr(to){
        const arr = to.path.split('/')
        arr.shift()
        let newArr;
        if(arr.length>2){
          const obj1 = {url:`/${arr[0]}`,name:STR[arr[0]]}
          const obj2 = {url:`/${arr[1]}/${arr[2]}`,name:STR[arr[2]]}
          newArr=[obj1,obj2]
        } else if(arr.length>1){
          const obj1 = {url:`/${arr[0]}`,name:STR[arr[0]]}
          const obj2 = {url:`/${arr[0]}/${arr[1]}`,name:STR[arr[1]]}
          newArr=[obj1,obj2]
        }else{
          const obj1 = {url:`/${arr[0]}`,name:STR[arr[0]]}
          newArr=[obj1]
        }
        store.dispatch(
          REPLACE,{breadArr:newArr}
        )
      },
      show(){
        store.dispatch(REPLACE, {isCollapse: !this.isCollapse}).then(
          ()=>{
            console.log(this.isCollapse)
            this.isCollapse?
              store.commit(REPLACE,{aSideWidth: '60px !important'}):
              store.commit(REPLACE,{aSideWidth: '14vw'})
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
      const to = this.$route
      if(to.name === 'config'){
        if(this.isCollapse === false){
          store.dispatch(REPLACE,{isCollapse:true,aSideWidth:'60px !important'})
        }
      }else{
        store.dispatch(REPLACE,{isCollapse:false,aSideWidth:'14vw'})
      }
      this.setBreadArr(to)
    },
  }
</script>
<style lang="scss" scoped>
  @import "../../style/index";

  .sidebar-container{ //菜单默认样式
    background: $side-background;
    ul{
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
  // 控制各个项的选中效果
  .yoy-icon1,.yoy-icon2{
    top:0;
    left:0;
    width:60px;
    height:48px;
    z-index: 0;
  }
  .yoy-icon1{
    z-index: 2;
  }
  .iconContainer{
    height:100%;
    width:60px;
    display: inline-block;
    vertical-align: middle;
    /*margin-right: 8%;*/
  }
  .side-menu-text{
    width:72%;
  }
  @media screen and (max-width:1920px){
    .side-menu-text{
      width:70%;
    }
  }
  @media screen and (max-width:1680px){
    .side-menu-text{
      width:67%;
    }
  }
  @media screen and (max-width:1440px){
    .side-menu-text{
      width:63%;
    }
  }


  .side-item-rightRow{
    position:absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
  }
</style>
