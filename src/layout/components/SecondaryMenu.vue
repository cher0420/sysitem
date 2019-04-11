<template>
  <el-menu
    :default-active="defaultActiveSecondM"
    class="menu"
    @open="handleOpen"
    @close="handleClose"
    @select="select"
    active-text-color="#2a8ce7"
    :default-openeds='openArr'
  >
    <el-menu-item index="0" class="f-s-14" disabled>
      <span slot="title" class="dis-i-b omit" style="width:152px">{{name}}</span>
    </el-menu-item>
    {{/*基本资料*/}}
    <el-menu-item v-if='!item.children' :key="item.id" v-for='item in secondMenus' :index="item.id" class="f-s-14">
      <template slot="title">
        <span>{{item.chineseName}}</span>
        <i class="el-icon-arrow-right"></i>
      </template>
    </el-menu-item>
    <el-submenu v-if="item.children" v-for='item in secondMenus' :key="item.id" :index="item.id" class="f-s-14" ref="test">
      <template slot="title">{{item.chineseName}}</template>
      <el-menu-item v-for='items in item.children' :index="items.id" :key="item.id">{{items.chineseName}}</el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>
  import {MENUS} from "../../constants/constants";
  import {REPLACE} from "../../store/mutations";
  import store from '../../store/index'

  export default {
      data(){
        return{
          openArr:['channel','knowledgeBuild'],
        }
      },
      name: "SecondaryMenu",
      computed:{
        secondMenus () {
          const pathArr = this.$route.path.split('/').filter( d => d )

          let arr = []
          for ( let item of MENUS.values() ) {
            switch (item.id) {
              case pathArr[0]:
                arr = item.children;
                break;
            }
          }
          return arr
        },
        defaultActiveSecondM(){
          return store.state.app.defaultActiveSecondM
        },
        name(){
          return store.state.app.name
        },
      },
      created(){
        const pathArr = this.$route.path.split('/')
        const defaultActiveSecondM = pathArr.length>4?pathArr[3]:pathArr[pathArr.length-1]
        const str = JSON.parse(sessionStorage.getItem('name'))
        const name = str?str:this.$route.query.name
        store.dispatch(REPLACE,{defaultActiveSecondM,name})
      },
      methods:{
        handleOpen(){
          this.$refs.test['aria-expanded'] = 'false'
        },
        handleClose(index,indexPath){

        },
        select(index,indexPath){
          const arr = store.state.app.breadArr
          const obj={
            url:'/config'
          }
          arr.splice(1,arr.length-1,obj)
          const to =  this.$route.path.split('/')
          const config = to[2] ==='config'
          store.dispatch(REPLACE,{breadArr:arr,config}).then(
            () =>{
              //拼接路由，目前三级路由
              const urlfir= this.$route.matched[0].path
              const urlSec = 'config'
              //当路由的name与index相等时，说明为二级菜单主页
              let url =''
              if(this.$route.name === index){
                url = `${urlfir}/${urlSec}`
              }else{
                url = `${urlfir}/${urlSec}/${index}`
              }

              const pathObj={
                query:{
                  recordId:this.$route.query.recordId,
                  name:this.$route.query.name
                },
                path:url
              }
              this.$router.push(
                pathObj
              )
            }
          )
        }
      }
    }
</script>

<style lang="scss" scoped>
  @import '../../style/index';
  .menu{
    height: 100%;
    width: 100%;
    background: $second-side;
    overflow-y: scroll;
  }
.omit{
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap
}
  .omit-other:after{
    display: inline;
    content: "...";
    font-size: 16px;
  }
</style>
