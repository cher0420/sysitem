<template>
 <div v-loading="loadingEdit" >
    <div class="keywordTip">
     <section class="title f-s-16 c555 box-sizing margin-b-30px">
      设置关键词（至多三个）
    </section>
     <div class="addContent">
        <el-input class="keyword"   placeholder="关键词1"  v-for ="item,index,value in keywordList" :placeholder="item" v-model="keywordList[$event]"  :index="key">  </el-input>
        <el-button  class="keywordBtn"  @click="addKey"  v-if="counter<2">  <i class="el-icon-error icon" ></i>添加关键词 </el-button>
   </div>
    <div class="tip"> <i class="el-icon-warning tipIcon"></i><span class="keywordTip">所添加的关键词需要同时出现机器人才会回复所设定回答哦</span></div>
    <el-button class="nextBtn" @click="nextAnswer">下一步</el-button>
    </div>
    </div>
</template>
<script>
  import {mapGetters,mapActions} from 'vuex';
  import {request} from "../../../../../serive/request";
  import {KEYWORDLIST, DELETEKEYWORD, KEYWORDLEADEXCEL, KEYWORDDOWNLOAD} from "../../../../../constants/api";
  import { getCookies } from "../../../../../utils/cookie";
  import {TOKEN} from "../../../../../constants/constants";

  export default {
    // name: "Allen-EditQA",
    data() {
      return {
        counter:1,
        keywordList: ["文思","海辉"],
        //input: {'a':"文思",'b':"海辉"},
        input:"name",
        obj: {
            a: 1, b: 2
        }

      }
    },
    computed:{},
    created() {

    },
    mounted() {


    },
    watch: {},
    methods: {
     init(){
      //  this.keywordList =  res.Basic.Image.slice(0);
     },
     addKey(){
      this.counter = this.keywordList.length++
      
     },
     answer(){
       console.log(1)
      
     },
     
      nextAnswer(){
        const that = this
 

      //  const url={path:'/bot/config/keywordResponse/editAnswer',}
       const url={path:'/bot/config/keywordResponse/repeatAnswer',}
       this.$router.push(url)
      //  const keywordList = []
      
        // addKeyword(URL.requestHost + ADDKEYWORD ).then(
        // res => {
        //   this.keywordList =  res.KeyWord.slice(0);
        //   // let data = "梨&橙子";
        //   // const arr = data.slice(1) + "&" 

        //   console.log(data)
        //   //判断关键词是否重复
        //   if (ResultValue=true) {
        //      const url={path:'/bot/config/keywordResponse/repeatAnswer',}
        //   } else {
        //     const url={path:'/bot/config/keywordResponse/editAnswer',}
        //   }

        // }
        // );

      },
      
      inputFun(e){
      // this.inputValue = e.target.value;
      }
    },
    destroyed() {
      clearInterval(this.timer);
    }

  }
</script>
<style lang="scss" scoped>
  @import '../../../../../style/index';
   .title{
    padding-left:10px;
    width: 100%;
    height:36px;
    line-height: 36px;
    background: #f9fafc;margin-bottom:30px;
  }
.keyword{width: 250px;margin-right:20px;}
.keywordBtn{border:none;color:#2a8ce7;padding:0;}
.keywordBtn:hover{background:none;}
.keywordTip{margin-top:10px;font-size: 12px;color: #999}
.nextBtn{color:#fff;background:#2a8ce7;border:none;margin-top:40px;}
.tip{margin-top: 10px;}
.tipIcon{display: inline;margin-right: 10px;}
.icon{transform: rotate(45deg);color:#2a8ce7;margin-right: 10px;
-ms-transform: rotate(45deg); /* IE 9 */
-moz-transform: rotate(45deg); /* Firefox */
-webkit-transform: rotate(45deg); /* Safari and Chrome */
-o-transform: rotate(45deg); /* Opera */}
</style>


