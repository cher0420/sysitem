<template>
  <div v-loading="loadingEdit">
    <nav-title title="添加关键词回复"/>
    <div class="keywordTip">
      <section class="title f-s-16 c555 box-sizing margin-b-30px" >设置关键词（至多三个）</section>
      <div style="height:32px;display: inline-block;">
        <div class="addContent" v-for="(item,index) in keywordList" :key="index">
          <div class="inputContent keyword">
            <el-input  v-focus type="text"
                       :placeholder="keywordList[index]" v-model="keywordList[index]"
                       @input="emptyKey(index)" :class="[indexList.indexOf(index) > -1?'keyword-changeColor':'']">
            </el-input>
            <!-- autofocus='true' -->
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
        <p v-show='!change' class="tipMessage" >请勿使用重复的关键词，且关键词不能为空也不能输入特殊字符</p>
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
  import { VERIFYDUPLICATED } from "../../../../../constants/api";
  import { getCookies } from "../../../../../utils/cookie";
  import { TOKEN } from "../../../../../constants/constants";
  import store from "../../../../../store/index";
  import NavTitle from '../../../../../components/NavTitle'

  export default {
    data() {
      return {
        counter: 0,
        keywordList: [''],
        change:true,
        isRed:false,
        regIndex:'index',
        autofocus: true,
        indexList:[]
      };
    },
    components:{
      NavTitle
    },
    created(){
      this.init();
    },
    mounted() {


    },
    watch: {

    },
    directives:{
      // 注册一个局部的自定义指令 v-focus
      focus: {
        // 指令的定义
        inserted: function (el) {
          // 聚焦元素
          el.querySelector('input').focus()
        }
      }

    },
    methods: {
      init(index) {
        this.store = sessionStorage.getItem("KeyWord");
        if (!this.store&&this.KeyWord==undefined) {
          this.change =true ;// 提示语
          this.disabled =true// 按钮
          this.isRed=true;//
          //this.regIndex = index//
        } else {
          this.keywordList = this.store.split("&");
          this.counter= this.keywordList.length-1;
          this.disabled =false//
        }

      },

      addKey(index) {
        this.counter  =this.keywordList.length++;
        console.log(this.counter)
        this.emptyKey();
        // this.regIndex = index;
        this.isRed=false;
        this.change =true ;// 提示语

      },
      delKeyword(index) {
        var arr = this.keywordList;
        var arr1 = Array.from(new Set(arr));
        if (this.keywordList.length>=2){
          if ( arr.length> arr1.length) {
            // console.log('chongddddd', '')
            this.change =true ;// 提示语
            this.disabled =false// 按钮
            this.isRed=false;//
            this.regIndex = index//
          }
          console.log('shan', '')
          this.keywordList.splice(index,1)
          console.log(this.keywordList)
          this.counter--;
          // this.emptyKey()
          this.change =true ;// 提示语
          this.disabled =false// 按钮
          this.isRed=false;//
          this.regIndex = index//
        };

        this.letters()
      },
      letters(){
        let letters=[]
        const test = new RegExp("&");
        this.keywordList.filter(
          (v, index, arr) => {

            if(!v){
              this.change =false ;// 提示语
              this.disabled =true// 按钮不可点  为true
              this.indexList.push(index)
              console.log('kong',index)
            } else  {
              if(v === arr[index + 1]){
                this.change =false ;// 提示语
                this.disabled =true// 按钮不可点  为true
                this.indexList.push(index)
                console.log('有重复',index)
                return
              }else{
                console.log('有值且不重复', '')

                const arry = this.indexList.filter(
                  (item) => {
                    if( !item == index){
                      return item
                    }
                  }
                )
                this.indexList = arry


              }


            }

          }
        )
        console.log(this.indexList)


      },
      emptyKey(index){
        var arr = this.keywordList;
        var arr1 = Array.from(new Set(arr));
        if (this.keywordList[index]) {
          this.disabled =false
          this.keywordList[index]=this.keywordList[index].replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g,'');
          var arr = this.keywordList;
          var arr1 = Array.from(new Set(arr));
          const arry = this.indexList.filter(
            (item) => {
              if( !item == index){
                return item
              }
            }
          )
          this.indexList = arry

          if (arr.length> arr1.length) {
            this.disabled =true
            this.indexList.push(index)
            this.change =false
            console.log('tag', '')
          } else {
            console.log('111', '')
            this.disabled =false
            this.change =true
            const arry = this.indexList.filter(
              (item) => {
                if( !item == index){
                  return item
                }
              }
            )
            this.indexList = arry

          }
        } else {
          this.change =false ;// 提示语
          this.disabled =true// 按钮不可点  为true
          this.isRed=true; //红色边框
          this.regIndex = index
          this.indexList.push(index)
        }
        this.letters()

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
        console.log(this.KeyWord)

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
    top: -5px;background: #fff;
    left: 243px;
  }
  .del:hover {
    color: #2a8ce7;
  }

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
