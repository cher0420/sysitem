<template>
  <div v-loading="loadingEdit">
    <div class="keywordTip">
      <section class="title f-s-16 c555 box-sizing margin-b-30px" >设置关键词（至多三个）</section>
      <div style="overflow:hidden;zoom:1;display: inline-block;">
        <div class="addContent" v-for="(item,index) in keywordList" :key="index">
          <div class="inputContent keyword">
            <el-input  type="text"
            onkeyup="value=this.value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g,'')" 
            onpaste="value=this.value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g,'')" 
            oncontextmenu = "value=this.value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g,'')"
            :placeholder="keywordList[index]" v-model="keywordList[index]" 
             @blur.prevent="emptyKey(index)"  :class="[regIndex === index?'changeColor':'']">
            </el-input>
              <!-- @input="emptyKey(index)"  -->
            <i class="el-icon-error del" @click="delKeyword(index)"></i>
          </div>
        </div>
        <span class="add">
        <el-button v-if="counter<2" class="keywordBtn" @click="addKey" :disabled="disabled">
          <i class="el-icon-error icon"></i>添加关键词
        </el-button>
        </span> 
      </div>
      <div class="tip">
        <p v-show='!change' class="tipMessage" >请勿使用重复的关键词，且关键词不能为空</p>
        <i class="el-icon-warning tipIcon"></i>
        <span class="keywordTip">所添加的关键词需要同时出现机器人才会回复所设定回答哦</span>
      </div>
      <el-button class="nextBtn" @click="nextAnswer" :disabled="disabled">下一步</el-button>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { request } from "../../../../../serive/request";
import { ADDKEYWORD, VERIFYDUPLICATED } from "../../../../../constants/api";
import { getCookies } from "../../../../../utils/cookie";
import { TOKEN } from "../../../../../constants/constants";
import store from "../../../../../store/index";
import vue from "vue";
import vuex from "vuex";

export default { 
  data() {
    return {
      counter: -1,
      keywordList: [''],
      change:true, 
       isRed:false,
       regIndex:''
    };
  },
  computed: {
     
  },
  created(){
    this.init(); // 页面初始化
  },
  mounted() {},
  watch: { 
    
  },
  methods: { 
    init(index) {
        this.store = sessionStorage.getItem("KeyWord");
        if (this.store==null) {  
            this.change =false ;
            this.isRed=true;
            this.disabled =true
        } else {
          this.keywordList = this.store.split("&"); 
        } 
    },
    addKey(index) { 
      this.counter = this.keywordList.length++; 
       if (!this.keywordList[index]){
        this.change =false ; 
        this.isRed=true;
        this.disabled =true
      } else { 
        this.change =true ;
        this.isRed=false;
        this.disabled =false   
      }
    },
    delKeyword(index) {
      if (this.keywordList.length>=2){
        this.keywordList.splice(index,1) 
        this.counter--; 
        return;
      } 
    },
    emptyKey(index){
      this.keywordList[index]=this.keywordList[index].replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g,'');
      var arr = this.keywordList ; 
      var arr1 = Array.from(new Set(arr)); 
      console.log(arr1.length)
      if (!this.keywordList[index]||arr.length> arr1.length){
        this.change =false ; 
        this.isRed=true;
        this.disabled =true
        this.regIndex = index
      } else { 
        this.change =true ;
        this.isRed=false;
        this.disabled =false   
         this.regIndex = ""
      }
    },
    nextAnswer() {
      const that = this;
      const KeyWord = this.keywordList.join("&");  
      const TenantId = store.state.app.userInfo.TenantId;
      const BotId = JSON.parse(sessionStorage.getItem('recordId'));
      const CreateUserId = store.state.app.userInfo.UserId;
      const CreateUserName = store.state.app.userInfo.FullName;
      const TenantDomain = store.state.app.userInfo.Email;
      sessionStorage.setItem("KeyWord", this.keywordList.join("&")); 

      const params = {
        headers: {
          "Access-token": getCookies(TOKEN)
        },
        method: "POST",
        body: JSON.stringify({
          TenantId,
          BotId,
          CreateUserName,
          CreateUserId,
          TenantDomain,
          KeyWord,
        })
      };

      request(VERIFYDUPLICATED, params).then(res => { 
        if (res.ResultValue.IsRepeat == true) { 
          const repeatId = res.ResultValue.RepeatModel.ID
          const url = { path: "/bot/config/keywordResponse/repeatAnswer", query:{repeatId}};
          this.$router.push(url); 
        } else {
          const url = { path: "/bot/config/keywordResponse/editAnswer" };
          this.$router.push(url);
        }
      });
    }
  },

  destroyed() {
    clearInterval(this.timer);
  }
};
</script>
<style lang="scss" scoped>
@import "../../../../../style/index";
.title {
  padding-left: 10px;
  width: 100%;
  height: 36px;
  line-height: 36px;
  background: #f9fafc;
  margin-bottom: 30px;
}
.addContent {
  display: inline-block;
}
.keyword {
  width: 250px;
  margin-right: 20px;
  float: left;
}
.keywordBtn {
  border: none;
  color: #2a8ce7;
  padding: 0;
  height: 30px;
  line-height: 30px;
  display: block;
  float: right;
}
.keywordBtn:hover {
  background: none;
}
.keywordTip {
  margin-top: 10px;
  font-size: 12px;
  color: #999;
}
.nextBtn {
  color: #fff;
  background: #2a8ce7;
  border: none;
  margin-top: 40px;
}
.tip {
  margin-top: 8px;
}
.tipIcon {
  display: inline;
  margin-right: 10px;
}
.inputContent {
  position: relative;
  float: left;
}
.del {
  position: absolute;
  top: 1px;
  left: 238px;
}
.del:hover {
  color: #2a8ce7;
}
.changeColor{border:1px solid red;}
.add .is-disabled{background: none;color:#7abafc;
.icon{color:#7abafc;}
}
.add .is-disabled:hover{background: none;color:#7abafc;
.icon{color:#7abafc;}
}
.is-disabled{background: #7abafc;color:#fff}
.is-disabled:hover{background: #7abafc;color:#fff}
.tipMessage{color: red;margin-top:-12px;margin-bottom: 10px;}
.tipMessages{display: block;}
.icon {
  transform: rotate(45deg);
  color: #2a8ce7;
  margin-right: 10px;
  -ms-transform: rotate(45deg); /* IE 9 */
  -moz-transform: rotate(45deg); /* Firefox */
  -webkit-transform: rotate(45deg); /* Safari and Chrome */
  -o-transform: rotate(45deg); /* Opera */
}
</style>