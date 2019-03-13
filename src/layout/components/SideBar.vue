<template>
  <section ref='menu'>
    <section index="" class="handle-item text-a-c" @click="show">
      <i class="yoy-menu-icon"></i>
    </section>
    <el-menu
      :default-active="activeKey"
      class="el-menu-vertical-demo"
      @select="handle"
      text-color="#cfd9e2"
      active-text-color="#fff"
      :collapse="isCollapse"
      :router="isRouter"
    >
      <el-menu-item :index="item.id" v-for="item in menus" :key="item.id">
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
  import {isIE9} from '../../serive/request';
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
      },
      activeKey (){
        return store.state.app.activeKey
      }
    },
    watch: {
      '$route' (to, from) {
        const that = this
        if(to&&from){

              // 面包屑，带优化
              this.setBreadArr(to)
              // 进入配置二级菜单页面
              const navIndexArr = to.path.split('/')
              const activeKey =navIndexArr[1]
              //设置标题
              if(to.name === 'detail'||to.name === 'edit'){
                const navIndex = to.query.title ?to.query.title:STR[to.name]
                  store.dispatch(REPLACE,{navIndex})
              }else{
                const navIndex = STR[navIndexArr[navIndexArr.length-1]]
                store.dispatch(REPLACE,{navIndex})
              }
              const config = navIndexArr[2] === 'config'
              let aSideWidth = null;
              if(config){
                aSideWidth = '60px !important'
                if(that.isCollapse === false){
                  store.dispatch(REPLACE,{isCollapse:true})
                }
              }else{
                aSideWidth = '14vw'
                store.dispatch(REPLACE,{isCollapse:false})
              }
              store.dispatch(REPLACE,{config,aSideWidth,activeKey}).then(
                () => {
                  that.reComputed()
                }
              )

        }else{
          this.$router.push('/dashboard')
        }

      }
    },
    methods: {
      setBreadArr(to){
        const arr = to.path.split('/')
        arr.shift()
        let newArr;
        const query = to.query
        if(arr.length>3){
          const obj1 = {url:{path:`/${arr[0]}`,query},name:STR[arr[0]]}
          const obj2 = {url:{path:`/${arr[0]}/${arr[1]}/${arr[2]}`,query},name:STR[arr[2]]}
          let name = to.query.title&&to.name !== 'edit'?to.query.title:STR[arr[3]]
          const obj3 = {url:{path:`/${arr[0]}/${arr[1]}/${arr[2]}/${arr[3]}`,query},name}
          newArr=[obj1,obj2,obj3]
        } else if(arr.length>2){
          const obj1 = {url:{path:`/${arr[0]}`,query},name:STR[arr[0]]}
          const obj2 = {url:{path:`/${arr[0]}/${arr[1]}/${arr[2]}`,query},name:STR[arr[2]]}
          newArr=[obj1,obj2]
        } else if(arr.length>1){
          const obj1 = {url:{path:`/${arr[0]}`,query},name:STR[arr[0]]}
          const obj2 = {url:{path:`/${arr[0]}/${arr[1]}`,query},name:STR[arr[1]]}
          newArr=[obj1,obj2]
        }else{
          const obj1 = {url:`/${arr[0]}`,name:STR[arr[0]]}
          newArr=[obj1]
        }
        store.dispatch(
          REPLACE,{breadArr:newArr}
        )
      },
      reComputed(){
        if(isIE9()){
            const realMenuWidth = this.$refs.menu.offsetWidth
            const realMainWidth = document.body.clientWidth - realMenuWidth-1 +'px'
            store.dispatch(REPLACE,{realMainWidth})
        }
      },
      show(){
        store.dispatch(REPLACE, {isCollapse: !this.isCollapse}).then(
          ()=>{

            this.isCollapse?
              store.commit(REPLACE,{aSideWidth: '60px !important'}):
              store.commit(REPLACE,{aSideWidth: '14vw'})

            this.reComputed()

          }

        )
      },
      handle(key, keyPath){
        const that = this
        if(key){
          window.location.hash=key
          const url = key
          const name = STR[key]
          const obj = {
            url,name
          }
          const arr=[obj]
          store.commit(REPLACE,{breadArr:arr})
          store.dispatch(REPLACE, {defaultActiveSecondM: 'config'}).then(
            () => {
              that.reComputed()
            })

          this.$router.push(key)
          window.location.hash = '#/'+key
        }
      }
    },
    created(){
      const arr = this.$route.path.split('/')
      const config = arr[2] ==='config'// 判断路由是否进入配置页面
      const activeKey = arr[1] //初始化一级菜单的选中值
      const to = this.$route
      if(config){ //如果是进入二级配置菜单，则显示二级菜单，且缩小一级菜单
        if(this.isCollapse === false){
          store.dispatch(REPLACE,{isCollapse:true,aSideWidth:'60px !important',activeKey,config})
        }
      }else{
        //显示一级菜单
        store.dispatch(REPLACE,{isCollapse:false,aSideWidth:'14vw',activeKey})
      }
      // 初始化面包屑
      this.setBreadArr(to)
    },
    mounted(){
      this.reComputed()
    }
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
