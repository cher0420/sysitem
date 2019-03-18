<template>
 <div v-loading="loadingEdit" >
     <section class="title f-s-16 c555 box-sizing margin-b-30px"> 设置关键词（至多三个）  </section>
    <p class="keyword">{{getKeyValue}}</p>
      <div class="addContent">
          <section class="title f-s-16 c555 box-sizing margin-b-30px">设置回答</section>
      </div>
      <div class="area">
        <textarea class="c555 anwer-area" v-model="getAnswer" rows="8" cols="10" @input="getTextTotal" maxlength="500"   placeholder="请输入自定义友好回答,最多500字"></textarea>
        <span>{{textTotal}}/500字</span>
      </div>
      <span>{{ result }}</span>
      <el-button class="nextBtn" @click="nextBtn">保存</el-button>
  </div>
</template>
<script>
  import {mapGetters,mapActions} from 'vuex';
  import {request} from "../../../../../serive/request";
  import {UPDATEANSWER,ADDKEYWORD} from "../../../../../constants/api";
  import { getCookies } from "../../../../../utils/cookie";
  import {TOKEN} from "../../../../../constants/constants"; 
  import store from '../../../../../store/index';
  // import { REPLACE } from "../../../../store/mutations";


  export default {
    name: "Allen-EditQA",
    data() {
      return {
        Answer:'',
        result: null,
        textTotal:0,
        getKeyValue:'',
        ID:'',
      }
    },
    computed: {},

    created() {
      this.init();  
    },
    mounted() {
    },
    watch: {
      kilometers:function(val) {
          this.kilometers = val;
          this.meters = val * 1000;

      },
      meters : function (val) {
          this.kilometers = val/ 1000;
          this.meters = val;
      },

    },

    methods: {
       init() { 
        this.getTextTotal(); 
        this.keyList();
        this.getAnswer = sessionStorage.getItem('AnsWer');  
        this.getkey();
       },
    
    

    getkey(){ 
       const that = this;
       const TenantDomain =store.state.app.userInfo.Email
       const ID =this.$route.query.ID 
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
      const getKeyValue = res.ResultValue.Keyword;
      this.getKeyValue =getKeyValue
      const getAnswer= res.ResultValue.Answer
      this.getAnswer=getAnswer 
      
      });
    },
     getTextTotal() {
        //this.textTotal =this.getAnswer.length;
      },
    keyList() {
      this.getAnswer = sessionStorage.getItem('AnsWer');  
    },
    nextBtn(){
      const that = this 
      const ID = this.$route.query.ID
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
        console.log(res.ResultValue)
         that.$message({
              type: 'success',
              message: '操作成功',
              duration: 2000
         });
      })
       sessionStorage.setItem('AnsWer',this.getAnswer)
       console.log(this.getAnswer)
    },
   
    },
    destroyed() {
       
    },

  }

</script>
<style lang="scss" scoped>
  @import '../../../../../style/index';
 .area{position: relative;width:70%;margin-left:40px;}
 .area span{position: absolute;bottom:15px;right: 0;color:#999;}
 .title{ padding-left:10px; width: 100%; height:36px; line-height: 36px; background: #f9fafc;margin-bottom:30px;}
 .anwer-area{height: 300px;outline: none;width: 100%;resize: none;padding: 10px;border:1px solid #e5ebf8;}
 .nextBtn{color:#fff;background:#2a8ce7;border:none;margin-top:40px;display: block;}
 .keyword{font-size:14px;color:#555;margin-bottom: 40px;}
</style>


