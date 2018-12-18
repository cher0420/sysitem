<template>
  <el-menu
    :default-active="defaultActiveSecondM"
    class=""
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
    <el-menu-item v-if='!item.children' v-for='item in secondMenus' :index="item.id" class="f-s-14">
      <template slot="title">
        <span>{{item.chineseName}}</span>
        <i class="el-icon-arrow-right"></i>
      </template>
    </el-menu-item>
    <el-submenu v-if="item.children" v-for='item in secondMenus' :index="item.id" class="f-s-14" ref="test">
      <template slot="title">{{item.chineseName}}</template>
      <el-menu-item v-for='items in item.children' :index="items.id">{{items.chineseName}}</el-menu-item>
    </el-submenu>
  </el-menu>
  <!--<section>-->
    <!--<section></section>-->
    <!--<section v-for="item in secondMenus">-->
      <!--{{item.chineseName}}-->
    <!--</section>-->
  <!--</section>-->
</template>

<script>
  import {SECONDMENUS} from "../../constants/constants";
  import {REPLACE} from "../../store/mutations";
  import store from '../../store/index'
  import {STR} from "../../constants/constants";

  export default {
      data(){
        return{
          openArr:['channel','knowledgeBuild'],
          secondMenus:SECONDMENUS,
        }
      },
      name: "SecondaryMenu",
      computed:{
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
        handleOpen(index,indexPath){
          this.$refs.test['aria-expanded'] = 'false'
        },
        handleClose(index,indexPath){

        },
        select(index,indexPath){
          const arr = store.state.app.breadArr
          const obj={
            name:STR[index],
            url:'/config'
          }
          arr.splice(1,arr.length-1,obj)
          const to =  this.$route.path.split('/')
          const config = to[2] ==='config'
          store.dispatch(REPLACE,{breadArr:arr,config,navIndex:STR[index]}).then(
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
              console.log('====',pathObj)
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
