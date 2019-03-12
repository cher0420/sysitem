<template>
 <div v-loading="loadingEdit" >
    <div class="keywordTip">

     <section class="title f-s-16 c555 box-sizing margin-b-30px"> 设置关键词（至多三个）  </section>
    <p class="keyword">{{keywordlist}}</p>
     <div class="addContent">
          <section class="title f-s-16 c555 box-sizing margin-b-30px">设置回答
          </section>
     </div>
     <div class="area">
    <textarea class="c555 anwer-area"  rows="8" cols="10" maxlength="500" placeholder="请输入自定义友好回答,最多500字" v-model="getAnswer"></textarea>
  
      <span>0/500字</span>
     </div>
     <el-button class="nextBtn" @click="reviseKeyword">修改关键词</el-button><el-button class="nextBtn" @click="reviseKAnswer">更新回答</el-button>
    </div>
    </div>
</template>
<script>
import {mapGetters,mapActions} from 'vuex';
  import {request} from "../../../../../serive/request";
  import {UPDATEANSWER} from "../../../../../constants/api";
  import { getCookies } from "../../../../../utils/cookie";
  import {TOKEN} from "../../../../../constants/constants";
  import store from '../../../../../store/index'
  import {REPLACE} from "../../../../../store/mutations";

  export default {
    name: "Allen-EditQA",
    data() {
      return {
      getAnswer:'',
      store:'',
      }
    },
    computed: {
    
    },

    created() {
       this.init();  // 页面初始化
     
    },
    mounted() {

    },
    watch: {},
    methods: {
        
       init() {
         this.keyList();
       },

      keyList() {
      this.keywordlist = sessionStorage.getItem('KeyWord');
      // console.log(keywordlist)
      this.getAnswer = sessionStorage.getItem('AnsWer');
         console.log(this.getAnswer);
         
      },



     reviseKeyword(){
       const url={path:'/bot/config/keywordResponse/addKeyword',}
       this.$router.push(url)
     },
      reviseKAnswer(){
       //const index = this.Answer
      const ID = store.state.app.userInfo.ID//?
      const BotId = sessionStorage.getItem("recordId")
      const TenantDomain =store.state.app.userInfo.Email
      const UpdateUserId=store.state.app.userInfo.Email
      const UpdateUserName=store.state.app.userInfo.Email 
      const AnsWer = this.getAnswer
      
      sessionStorage.setItem('AnsWer',this.getAnswer)
     

       const params = {
         headers:{
           'Access-token': getCookies(TOKEN)
         },
         method: 'POST',
         body: JSON.stringify({
            ID, BotId,TenantDomain,UpdateUserId,UpdateUserName,AnsWer
         })
       }
        request(UPDATEANSWER,params).then(
          (res)=>{
          console.log(res.ResultValue)

          }
        )
     }



    },
    destroyed() {
      clearInterval(this.timer);
    }

  }
</script>
<style lang="scss" scoped>
  @import '../../../../../style/index';
 .area{position: relative;width:70%;margin-left:40px;}
 .area span{position: absolute;bottom:15px;right: 0;color:#999;}
 .title{ padding-left:10px; width: 100%; height:36px; line-height: 36px; background: #f9fafc;margin-bottom:30px;}
 .anwer-area{height: 300px;outline: none;width: 100%;resize: none;padding: 10px;border:1px solid #e5ebf8;}
 .nextBtn{color:#fff;background:#2a8ce7;border:none;margin-top:40px;display: inline-block;}
 .keyword{font-size:14px;color:#555;margin-bottom: 40px;}
</style>


