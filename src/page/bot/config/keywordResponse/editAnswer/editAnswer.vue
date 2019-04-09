<template>
 <div v-loading="loadingEdit" >
   <nav-title title="添加关键词回复"/>
     <section class="title f-s-16 c555 box-sizing margin-b-30px"> 设置关键词（至多三个）  </section>
    <p class="keyword">{{keywordlist}}</p>
      <div class="addContent">
          <section class="title f-s-16 c555 box-sizing margin-b-30px">设置回答</section>
      </div>
      <div class="area">
        <textarea class="c555 answer-area"
        v-model.trim="getAnswer" rows="8" cols="10" type="text"
        @input="getTextTotal" maxlength="500"
       placeholder="请输入自定义回答，最多500个字符" ></textarea>
        <p>{{textTotal}}/500字</p>
      </div>
      <span>{{ result }}</span>
      <el-button class="nextBtn" @click="nextBtn" :disabled="disabled">保存</el-button>
  </div>
</template>
<script>
  import {mapGetters,mapActions} from 'vuex';
  import {request} from "../../../../../serive/request";
  import {UPDATEANSWER,ADDKEYWORD} from "../../../../../constants/api";
  import { getCookies } from "../../../../../utils/cookie";
  import {TOKEN} from "../../../../../constants/constants";
  import store from '../../../../../store/index'
  import NavTitle from '../../../../../components/NavTitle'

  export default {
    name: "Allen-EditQA",
    data() {
      return {
        Answer:'',
        result: null,
        textTotal:0
      }
    },
    computed: {},
    components:{
      NavTitle
    },
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
          this.keyList();
          this.getTextTotal();
          this.getAnswer = sessionStorage.getItem('AnsWer');
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
            //  var reg=/^[\s　]|[ ]$/gi;
            // return !reg.test(value);
             console.log(this.getAnswer)
          if (this.getAnswer.length <=0) {
           this.disabled =true
        } else {
           this.disabled =false
        }
         this.textTotal =this.getAnswer.length;
        }
      },
     nextBtn(){
      const that = this
      // console.log(sessionStorage.getItem('KeyWord'));
      const KeyWord = sessionStorage.getItem('KeyWord');
      const TenantId = store.state.app.userInfo.TenantId;
      const CreateUserId = store.state.app.userInfo.UserId;
      const CreateUserName = store.state.app.userInfo.FullName;
      const ID = store.state.app.userInfo.ID//?
     const BotId = JSON.parse(sessionStorage.getItem('recordId'))
      const TenantDomain =store.state.app.userInfo.Email
      const UpdateUserId=store.state.app.userInfo.Email
      const UpdateUserName=store.state.app.userInfo.Email
      const AnsWer = this.getAnswer
      console.log(KeyWord)
      sessionStorage.setItem('AnsWer',this.getAnswer)
       const params = {
         headers:{
           'Access-token': getCookies(TOKEN)
         },
         method: 'POST',
         body: JSON.stringify({
            TenantId,BotId,TenantDomain,AnsWer,KeyWord,CreateUserId,CreateUserName
         })
       }
        request(ADDKEYWORD, params).then(res => {
        that.$message({
          type: "success",
          message: "操作成功",
          duration: 2000
        });
      }).then(() => {
          const url = { path: "/bot/config/keywordResponse"};
          sessionStorage.removeItem("KeyWord")
          sessionStorage.removeItem("AnsWer")
          setTimeout(
            () => {
              this.$router.push(url);
            }, 800
          )
          })

      // request(UPDATEANSWER,params).then(
      //     (res)=>{
      //   console.log(res.ResultValue)
      //    that.$message({
      //         type: 'success',
      //         message: '操作成功',
      //         duration: 2000
      //    });
      // })
    }
    },
    destroyed() {

    },

  }

</script>
<style lang="scss" scoped>
  @import '../../../../../style/index';
 .area{position: relative;width:70%;margin-left:40px;border:1px solid #e5ebf8;}
 .area p{color:#999;z-index: 9999;text-align: right;padding-right: 10px;padding-bottom: 5px;}
 .title{ padding-left:10px; width: 100%; height:36px; line-height: 36px; background: #f9fafc;margin-bottom:30px;}
 .answer-area{height: 300px;outline: none;width: 100%;resize: none; padding:10px;border:none;box-sizing:border-box;}
 .nextBtn{color:#fff;background:#2a8ce7;border:none;margin-top:40px;display: block;}
 .keyword{font-size:14px;color:#555;margin-bottom: 40px;}
 .is-disabled{background: #7abafc;color:#fff}
.is-disabled:hover{background: #7abafc;color:#fff}
</style>


