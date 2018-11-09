<template>
  <section class="yoy-main c777">
    <section class="tapList">
      <span class="firTap">选择渠道：</span>
      <span v-for="(data,key,index) in tapList"  class="text-a-c" v-bind:class="{isChecked:key === botCheckIndex}" @click="handleClick(key)" :index="key">
        <i :style="{background: key === botCheckIndex?
        'url(' + require(`../../../../assets/bot/${key}Checked.png`) + ')center center no-repeat':
          'url(' + require(`../../../../assets/bot/${key}.png`) + ')center center no-repeat'
        }" alt="" class="align-middle"></i>
        {{data}}
      </span>
    </section>
    <el-tabs v-model="activeName2" type="card" @tab-click="handleTip" class="yoy-tabs">
      <el-tab-pane label="标准回答" name="first" class="yoy-tab-pane" v-html="str">
      </el-tab-pane>
      <el-tab-pane label="友好回答" name="second" class="yoy-tab-pane">
        <section v-html="str">
        </section>
      </el-tab-pane>
    </el-tabs>
  </section>
</template>
<script>
import {detail} from "../knowledgeQuiz/constants";
import store from '../../../../store/index'
import {REPLACE} from "../../../../store/mutations";

export default {
    data(){
      return{
        activeName2: 'first',
        botCheckIndex: 'weChat',
        tapList: {weChat:'微信端',web:'网页端',desktop:'桌面',robot:'实体机器人'},
        str:''
      }
    },
    destroyed(){
        store.dispatch(REPLACE,{navIndexSecond:''})
    },
    created(){
      const botCheckIndex = this.$route.query.botCheckIndex
      const botName = this.$route.query.botName
      const botIndex = this.$route.query.botIndex
      const str = detail[botName][botIndex]
      console.log(botCheckIndex, botName, botIndex)
      this.str=str.replace(/\n+/g, "<br/>")
      this.botCheckIndex = botCheckIndex
    },
    methods: {
      handleClick(v) {
        this.botCheckIndex=v
      },
      handleTip(v){

      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../../../style/index";

  .tapList{
    height: 48px;
    line-height: 48px;
    background: #f9fafc;
    padding-left: 12px;
    .firTap{
      width: 88px;
    }
    i{
      display: inline-block;
      height: 28px;
      width: 30px;
      margin-right: 10px;
    }
    span{
      display: inline-block;
      width: 160px;
    }

    .unChecked{
      color: #777;
      background: #f9fafc;
    }
    .text-a-c:hover{
      cursor: pointer;
      color: $primary-color;
    }
    .isChecked{
      color: $primary-color;
      background: #f0f2f7;
    }
  }
  .yoy-tabs{
    margin-top: 20px;
  }
  .yoy-tab-pane{
    height: 260px;
    margin: 20px 0;
    padding: 0 20px;
    overflow-y: scroll;
    box-sizing: border-box;
  }
</style>
