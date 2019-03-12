<template>
 <div v-loading="loadingEdit" >
    <div class="keywordTip">
     <section class="title f-s-16 c555 box-sizing margin-b-30px">
      设置关键词（至多三个）
    </section>
     <div class="addContent">
        <div  v-for ="(item,index) in keywordList"  class="inputContent">
            <el-input class="keyword"   :placeholder="keywordList[index]"  v-model="keywordList[index]" >  </el-input>
            <i class="el-icon-error del" @click="delKeyword" ></i>
        </div>
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
  import {ADDKEYWORD,VERIFYDUPLICATED} from "../../../../../constants/api";
  import { getCookies } from "../../../../../utils/cookie";
  import {TOKEN} from "../../../../../constants/constants";
  import store from '../../../../../store/index'
  import vue from 'vue'
  import vuex from 'vuex'


  export default {
    // name: "Allen-EditQA",
    data() {
      return {
        counter:-1, 
        keywordList: [ ],
      }
    },
    computed:{},
    created() {
          this.init();  // 页面初始化
    },
    mounted() {


    },
    watch: {},
    methods: {
     init(){
        this.store=sessionStorage.getItem('KeyWord');
        this.keywordList = this.store.split("&");
     },
     addKey(){
      this.counter = this.keywordList.length++;
      console.log(counter)
      
     },
     answer(){
       console.log(1)
     },
    delKeyword(){
      console.log(12888)
      //删除当前 关键词
        // var num = this.cc.indexOf('item')
        // this.cc.splice(num - 1, 1)
        sessionStorage.getItem('keyword', this.cc)
      //  sessionStorage.removeItem(key, value)
    },
    nextAnswer(){
        const KeyWord = this.keywordList.join('&')
        console.log(KeyWord)  //梨&橙子
        const TenantId = store.state.app.userInfo.TenantId
        const BotId = sessionStorage.getItem("recordId")
        const CreateUserId = store.state.app.userInfo.UserId
        const CreateUserName = store.state.app.userInfo.FullName
        const TenantDomain =store.state.app.userInfo.Email
        const Answer = 'ee'
    
      sessionStorage.setItem('KeyWord',this.keywordList.join('&'))

        const params = {
          headers:{
            'Access-token': getCookies(TOKEN)
          },
          method: 'POST',
          body: JSON.stringify({
              TenantId, BotId,CreateUserId,CreateUserName,TenantDomain,KeyWord,Answer
          })
        }
        
        request(VERIFYDUPLICATED,params).then(
          (res)=>{
          console.log(res)

         if (res.ResultValue = false) {
              const url={path:'/bot/config/keywordResponse/repeatAnswer',}
              this.$router.push(url)
            } else {
              const url={path:'/bot/config/keywordResponse/editAnswer',}
              this.$router.push(url)
            }
          }
        )

        request(ADDKEYWORD,params ).then(
          ( res ) => {
            console.log(123)
          }
        );

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
.addContent{overflow: hidden;zoom: 1;}
.keyword{width: 250px;margin-right:20px;float: left;}
.keywordBtn{border:none;color:#2a8ce7;padding:0;height: 30px;line-height: 30px;}
.keywordBtn:hover{background:none;}
.keywordTip{margin-top:10px;font-size: 12px;color: #999}
.nextBtn{color:#fff;background:#2a8ce7;border:none;margin-top:40px;}
.tip{margin-top: 10px;}
.tipIcon{display: inline;margin-right: 10px;}
.inputContent{position: relative;}
.del{position: absolute;top:1px;left:238px;}
.del:hover{color:#2a8ce7;}
.icon{transform: rotate(45deg);color:#2a8ce7;margin-right: 10px;
-ms-transform: rotate(45deg); /* IE 9 */
-moz-transform: rotate(45deg); /* Firefox */
-webkit-transform: rotate(45deg); /* Safari and Chrome */
-o-transform: rotate(45deg); /* Opera */}
</style>


