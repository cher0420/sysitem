<template>
<div v-loading="loadingEdit"  class="p-relative">
    <section class="pop" v-show='!change'>
      <div class="location">
        <div class="guide">
          通过设置引导问题，用户可自定义机器人展示问候语时附加“引导问题”， <br>回复形式为：问候语+引导语+引导问题
            - 问候语设置：可在“渠道配置”中进行自定义设置 <br>
            - 引导语设置：自定义引导语，设置完成后出现形式如下图<br>
            - 引导问题设置：选择添加右侧知识库中的知识，设置完成后出现形式如下图
        </div>
        <section class="way">
          <div style="margin-right:60px">
             <img src="../../../../assets/guide/微信端.png" alt="">
             <p class="center">微信端</p>
          </div>
            <p class="guide text">您好，请问有什么能帮助您？ <br>
              您可以尝试这样问我： <br>
              引导问题1<br>
              引导问题2<br>
              引导问题3<br>
              ...</p>
              <div style="margin-left:60px">
                 <img src="../../../../assets/guide/网页端.png" alt="">
                 <p class="center">网页端</p>
              </div>
        </section>
        <div style="text-align:center;width:60%;"><el-button  class="open" @click="mask">我知道了</el-button></div>
      </div>
    </section>
    <section class="startIt">
    </section>
    <section class="title">
      <div class="line"></div>
      引导问题 <span><i class="el-icon-question"></i>什么是引导问题？</span>
    <el-button class="on" v-show='!change' @click="start">开启</el-button>
    <span class="stopBtn" v-show='!stopIt' >
        <el-button class="off"  @click="stop">停用</el-button>
        <el-button class="on"  @click="clearAll">清空数据</el-button>
    </span>

    </section>
    <section class="config">引导语设置</section>
    <!-- <textarea name="" id="" cols="90" rows="5" class="area" placeholder="例如：您可以尝试这样问我："></textarea> -->
    <div class="area">
        <textarea class="c555 anwer-area"
        v-model="getAnswer" rows="8" type="text"
        @input="getTextTotal" maxlength="500"
        onkeyup="this.value=this.value.replace(/\s+/g,'')"
       placeholder="请输入自定义回答，最多500个字符" ></textarea>
        <span>{{textTotal}}/500字</span>
      </div>
     <section class="config">选择引导问题（最多5个）</section>
        <tap-item></tap-item>
        <el-button class="open" :disabled="!disabled" @click="openKnowLedgeStore">打开知识库</el-button>
     <section class="config">选择渠道</section>
     <div class="checkbox">
        <p><el-checkbox v-model="checked1">网页</el-checkbox></p>
        <p><el-checkbox v-model="checked2">微信</el-checkbox></p>
        <p class="tip"> <i class="el-icon-warning"> </i>默认引导语与引导问题问候语一同出现</p>
     </div>
     <el-button class="open save" :disabled="!disabled" @click="save">保存</el-button>
    <knowledge-store ref="knowledge"/>
</div>

</template>
<script>
  import KnowledgeStore from './knowledgeStore'
  import TapItem from './TapItem'
  import store from './store'
  import {UPDATE} from "./store/mutations";

  export default {
    data() {
      return {
        change:false,
        stopIt:true,
        getAnswer:'',
        textTotal:0,
         checked1: true,
        checked2: true,
      }
    },
    created() {

    },
    components:{
      KnowledgeStore,
      TapItem
    },
    destroyed(){

    },
    methods: {
      init() {
        this.tableData = []
        this.total = 0
      },
      start(){

           this.disabled =true
           this.change=true
           this.stopIt=false
      },
      stop(){
         this.disabled =false
         this.change=false
         this.stopIt=true
      },
      mask(){
          console.log('zhezhao' )
           this.change=true
      },
      clearAll(){
          console.log('clear', '')
      },
     getTextTotal() {
         this.textTotal =this.getAnswer.length;

      },
      save(){
        console.log('save', '')
      },
      openKnowLedgeStore(){
        store.dispatch( UPDATE, {isSpread: true} )
      }
    }
  }
</script>
<style scoped lang="scss">
  @import "../../../../style/index.scss";

  .pop{position:fixed;top:60px;left:260px;background: rgba($color: #000000, $alpha: .5);display: block; width:100%;height: 100%;z-index:999;display:none;
      .location{margin-top:150px;margin-left:150px;
      .way{margin-top:40px;margin-bottom: 30px;
        display: flex;
        .text{height: 250px;}
      }
      .center{text-align: center;color: #fff}
      }

      .guide{background:#eaedf1;border-radius: 10px;display: inline-block;padding:30px;}
  }
 .startIt{width:3000px;height: 300px;background:rgba($color: #928e8e, $alpha: .5);position:fixed;z-index: 99;display: none;}
  .line{
    display: inline-block;
    width: 2px;
    height: 24px;
    background-color: #2a8ce7;
    margin-right: 6px;}
.title{border-bottom:1px solid #eaedf1;color: #555;font-size: 24px;  font-family: "Microsoft YaHei";
      span{font-size: 12px;color:#2a8ce7;margin-left:15px;display: inline-block;}
      .on{float: right;background: #2a8ce7;color:#fff;z-index:990;}
      .off{background: red;color:#fff;float: right;z-index: 888;}
}
.open{background: #2a8ce7;color:#fff;border:1px solid #2a8ce7;margin-left: 40px;}
.config{background:#f9fafc;font-size:16px;margin:30px 0;height: 40px;line-height: 40px;}
// .area{border:1px solid #eaedf1}
.area{position: relative;width:70%;margin-left:40px;width:60%;
  span{position: absolute;bottom:15px;right: 0;color:#999;}
  textarea{width:100%;border:1px solid #eaedf1;}
 }
  .checkbox{margin-left:40px;
      p{margin-bottom:30px;}
      .tip{color:#999;}
}
.stopBtn{display: inline-block;float: right;}
.save{margin-left:0px;}
.is-disabled{background: #7abafc;color:#fff;border:1px solid #fff;}
.is-disabled:hover{background: #7abafc;color:#fff;border:1px solid #fff;}
</style>
