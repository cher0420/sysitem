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
    <textarea class="c555 anwer-area"  @input="getTextTotal" rows="8" cols="10" 
 v-model.trim="getAnswer"  placeholder="请输入自定义回答，最多500个字符"
     ></textarea>
      <span>{{textTotal}}/500字</span>
     </div>
     <el-button class="nextBtnFix" @click="reviseKeyword">修改关键词</el-button>
     <el-button class="nextBtn" @click="nextBtn"  :disabled="disabled">更新回答</el-button>
    </div>
    </div>
</template>
<script>
import {mapGetters,mapActions} from 'vuex';
  import {request} from "../../../../../serive/request";
  import {UPDATEANSWER,ADDKEYWORD} from "../../../../../constants/api";
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
      textTotal:0,
      }
    },
    computed: {
    
    },

    created() {
       this.init();  // 页面初始化
      //  console.log(this.$route.query.repeatId)
     
    },
    mounted() {

    },
    watch: {},
    methods: {
       init() {
         this.keyList();
         this. getTextTotal();
          this.getRepeatAnswer();
       },
      keyList() {
      this.keywordlist = sessionStorage.getItem('KeyWord');
      this.getAnswer = sessionStorage.getItem('AnsWer'); 
      },

      getTextTotal() {
        if (this.getAnswer==null) {
         this.disabled =true
        } else {
          this.getAnswer = this.getAnswer.replace(/^[\s　]|[ ]$/gi,'');
            if (this.getAnswer.length <=0) {
            this.disabled =true
          } else {
            this.disabled =false
          }
          this.textTotal =this.getAnswer.length;
        }
      },

     reviseKeyword(){
       const url={path:'/bot/config/keywordResponse/addKeyword',}
       this.$router.push(url)
     },

    nextBtn(){
      const that = this
      const ID = sessionStorage.getItem('ID')
      const KeyWord = sessionStorage.getItem('KeyWord');
      const TenantId = store.state.app.userInfo.TenantId;
      const CreateUserId = store.state.app.userInfo.UserId;
      const CreateUserName = store.state.app.userInfo.FullName; 
      const BotId = JSON.parse(sessionStorage.getItem('recordId'))
      const TenantDomain =store.state.app.userInfo.Email
      const UpdateUserId=store.state.app.userInfo.Email
      const UpdateUserName=store.state.app.userInfo.Email 
      const AnsWer =this.getAnswer 

      sessionStorage.setItem('AnsWer',this.getAnswer)
       const params = {
         headers:{
           'Access-token': getCookies(TOKEN)
         },
         method: 'POST',
         body: JSON.stringify({
            ID,AnsWer,CreateUserId,UpdateUserName,TenantDomain,BotId
         })
       }

      request(UPDATEANSWER,params).then(
          (res)=>{
        // console.log(res.ResultValue)
         that.$message({
              type: 'success',
              message: '操作成功',
              duration: 2000
         });

      }).then(() => { 
          const url = { path: "/bot/config/keywordResponse"};
          this.$router.push(url);
          sessionStorage.removeItem("KeyWord")
          sessionStorage.removeItem("AnsWer")
          })
       sessionStorage.setItem('AnsWer',this.getAnswer)
      //  console.log(this.getAnswer)
     
 
       
    },

    getRepeatAnswer(){
      const that = this
      const ID =this.$route.query.repeatId
      const TenantDomain =store.state.app.userInfo.Email
      const BotId = JSON.parse(sessionStorage.getItem('recordId')) 

      const params = {
        headers:{
          'Access-token': getCookies(TOKEN)
        },
        method: 'get',
      }
    
    const url = '/api/admin/keyword/KQA/get/'+TenantDomain+'/'+BotId+'/'+ID
    request(url, params).then(res => { 
      const that = this;
      // console.log(res.ResultValue.ID)
      sessionStorage.setItem("ID", res.ResultValue.ID); 
      const getKeyValue = res.ResultValue.Keyword;
      this.getKeyValue =getKeyValue
      const getAnswer= res.ResultValue.Answer
      this.getAnswer=getAnswer 
      this.textTotal =this.getAnswer.length; 
      
      });

    },


   getkey(){ 
       const that = this;
       const TenantDomain =store.state.app.userInfo.Email
       const ID =this.$route.query.ID 
       const BotId = JSON.parse(sessionStorage.getItem('recordId'))
      
    },


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
 .nextBtnFix{border:1px solid #2a8ce7;color:#2a8ce7}
 .keyword{font-size:14px;color:#555;margin-bottom: 40px;}
 .is-disabled{background: #7abafc;color:#fff}
.is-disabled:hover{background: #7abafc;color:#fff}
</style>


