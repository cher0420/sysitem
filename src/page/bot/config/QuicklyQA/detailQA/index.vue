<template>
  <div class="yoy-main">
    <div class="keywordTip">
      关键词
    </div>
    <div class="kwShow">
      {{Keyword}}
    </div>
    <div class="keywordTip">
      答案详情
    </div>
    <div class="edit_textarea" v-html="Text.Answer">
    </div>
    <div class="photoUpp" v-if="Image.length>0">
      <input @change="fileChange($event)" type="file" id="upload_file" multiple style="display: none"/>
      <!-- show photo -->
      <div class="upload_warp_img" v-if="Image.length!=0">

        <div class="upload_warp_img_div cc222" @click="showIph(item)" v-for="(item,index) of Image"
             v-if="item.Answer != '' " >
          <div class="upload_warp_img_div_top">
            <div class="upload_warp_img_div_text">
              <!-- 放大图片+ -->
              <i class="el-icon-zoom-in" @click="OldPhotoMagnify(index)"></i>
            </div>
          </div>
          <!--<embed :src="item.Answer" >-->
          <!--<iframe :src="item.Answer" frameborder="0"></iframe>-->
          <img :src="item.Answer">
        </div>
      </div>
    </div>
    <div class="buttonSubb">
      <el-button type="primary" size="mini" @click="finishReturn()" style="margin-right: 10px;">完成</el-button>
      <el-button type="primary" plain size="mini" @click="EditReturn()" v-if="editor">编辑</el-button>
      <el-button type="primary" plain size="mini" disabled v-if="!editor">编辑</el-button>
    </div>
    <!-- -->
    <el-dialog
      title="图片预览"
      :visible.sync="dialogVisible"
      width="45%"
      :before-close="handleClose">
      <div class="PreviewImgg"><img :src="PreviewImg"></div>
      <span slot="footer" class="dialog-footer"></span>
    </el-dialog>

  </div>
</template>
<script>


  import {mapGetters} from 'vuex';
  import {mapActions} from 'vuex';

  import {TOKEN} from "../../../../../constants/constants";
  import {getCookies} from "../../../../../utils/cookie";
  import base from "../../../../../host/baseUrl";
  import store from "../../../../../store/index"


  export default {
    name: "Allen-detailQA",
    data() {
      return {
        editor: true,

        PreviewImg: "", // 预览图片src
        dialogVisible: false,

        // 根据关键字获取答案
        Question: "",
        Keyword: "",
        // 根据关键字获取 答案  / 图片
        Text: {
          ID: "",
          Answer: "",
        },
        Image: [{
          ID: "",
          Answer: "",
        }],


      }
    },
    computed: {},

    created() {
      this.getData()
    },
    mounted() {


    },
    watch: {},

    methods: {
      showIph(item) {
        this.PreviewImg = item.Answer;
        this.dialogVisible = true;
        // console.log(item)
      },

      getData() {
        // let query = this.$route.query;
        let detaildata = sessionStorage.getItem("detaildata"); // => 返回
        let query = JSON.parse(detaildata);
        if (query.Status == "4" || query.Status == "5") {
          this.editor = false;
        } else {
          this.editor = true;
        }

     //   console.log("取值", query)

        this.Question = query.Question;
        this.Keyword = query.Keyword;

        this.getCheckKeywords();
        return false;
      },
      getCheckKeywords() {  //  	根据关键字 获取详情
        let that = this;
        const token = getCookies(TOKEN);
        let recordId = JSON.parse(sessionStorage.getItem('recordId'));
        let data = {
          "BotConfigId": recordId,
          "Keys": that.Keyword
        }
        $.ajax({
          type: "POST",
          headers: {
            "Content-Type": "application/json;charset=utf-8",
            'Access-Token': token
          },
          url: base.requestHost + "/api/QuickQA/QueryQAData",
          data: JSON.stringify(data),
          success: function (msg) {
            if (msg.Status == "1") {
              if (msg.Data != null) {
                // code
                that.Question = msg.Data.Question;
                that.Keyword = msg.Data.Keyword;
                 that.Text = msg.Data.Text;
                that.Text.Answer =  msg.Data.Text.Answer.replace(/\n+/g, "<br/>")


                that.Image = msg.Data.Image;


              }

            }

          }
        })


      },
      finishReturn() {

        // 跳转到列表页
        const query = this.$route.query;
        this.$router.push({
          path: '/bot/config/quicklyQA',
          query: {
            ...query,
          }


        })


      },
      EditReturn() {
        let obj = {};
        obj.Question = this.Question;
        obj.Keyword = this.Keyword;

        sessionStorage.setItem('edit', JSON.stringify(obj)); // 存入


        // 跳转到编辑页
        const query = this.$route.query;
        sessionStorage.setItem('recordId', JSON.stringify(query.recordId)); // 存入
        //  console.log("query",query)

        this.$router.push({
          path: '/bot/config/quicklyQA/editQA',
          query: {
            ...query,
            recordId: query.recordId,
          }


        })


      },
      OldPhotoMagnify(index) {
        this.dialogVisible = true;
        this.PreviewImg = this.Image[index].Answer;
      },


      checkSize() { // 计算文本域字数
        let that = this;
        this.timer = setInterval(function () {
          if (that.textarea.length > 500) {
            that.textarea = that.textarea.toString().substr(0, 500);
          }
        }, 200)
      },


    },
    destroyed() {
      clearInterval(this.timer);

    }

  }
</script>
<style lang="scss" scoped>
  @import '../../../../../style/index';
  /*@import "../../../../../static/base.css";*/

  .buttonSubb {
    /*text-align: right;*/
    margin-top: 30px;
    margin-bottom: 30px;
    max-width: 1040px;
    box-sizing: border-box;
  }

  .PreviewImgg {
    text-align: center;
  }

  .PreviewImgg img {
    width: 360px;
  }

  .upload_warp_img_div_text {
    width: 80px;
    height: 80px;
    text-align: center;
    font-size: 20px;
    color: transparent;
  }

  .upload_warp_img_div_text:hover {
    color: #fff;
  }

  .upload_warp_img_div_text i {
    cursor: pointer;
    line-height: 80px;
    text-align: center;

  }

  .upload_warp_img_div_top:hover {

    height: 100%;
    background: rgba(0, 0, 0, 0.4);

    cursor: pointer;
  }

  .max1000 {
    max-width: 1000px;
    text-align: right;
    margin-left: 40px;
    margin-top: -21px;
    z-index: 3;
    word-break: keep-all;
  }

  .max1000 span {
    margin-right: 10px;
  }

  .keywordTip {
    height: 36px;
    line-height: 36px;
    font-size: 18px;
    background: #F9FAFC;
    padding-left: 10px;

  }

  .questionTitl {
    color: #555;
    font-size: 24px;
    margin-top: -85px;
    margin-left: 10px;
    margin-bottom: 30px;
  }

  .subFinsh {
    position: absolute;
    right: 0;
    top: 30px;
  }

  .imgLimit {
    display: inline-block;
    color: #c3c3c3;
    margin-left: 20px;
  }

  .kwShow {
    padding-bottom: 40px;
    padding-top: 30px;
    padding-left: 40px;
    font-size: 16px;
  }

  .edit_textarea {
    margin-top: 30px;
    padding-left: 40px;
    font-size: 14px;
    color: #555;
    /*position: relative;*/
  }

  .edit_textarea .fontCount {
    word-break: keep-all;
    /*position: absolute;*/
    /*right: 7px;*/
    /*bottom: 5px;*/
    color: #999;
  }

  .upload_warp_img {
    display: inline-block;
    vertical-align: middle;
    position: relative;
  }

  .upload_warp_img_div_top {
    position: absolute;
    left: 0;
    top: 0;
    width: 80px;
    height: 16px;
    /*background: rgba(226, 226, 226, 0.4);*/
  }

  .upload_warp_left {
    display: inline-block;
    vertical-align: middle;
  }

  .upload_warp_left {
    width: 80px;
    height: 80px;
    border: 1px dashed #c3c3c3;
    text-align: center;
    line-height: 80px;
    font-size: 30px;
    color: #c3c3c3;
  }

  .upload_warp_left:hover {
    border-color: #409eff;
    color: #409eff;
    cursor: pointer;
  }

  .upload_warp_img_div {

    width: 80px;
    height: 80px;
    /*border: 1px solid red;*/
    margin-right: 20px;
    /*-webkit-box-shadow: 0 0 10px #c0c4cc;*/
    /*-moz-box-shadow: 0 0 10px #c0c4cc;*/
    cursor: pointer;
    /*box-shadow: 0 0 10px #c0c4cc;*/
  }

  .upload_warp_img_div img {
    width: 100%;
    height: 100%;
  }

  .photoUpp {
    /*background: #F9FAFC;*/
    /*margin-top: 22px;*/
    /*margin-left: 40px;*/
    position: relative;
    max-width: 1040px;
    padding: 20px 40px;
    margin-top: 30px;
    box-sizing: border-box;
    min-height: 124px;
  }

  .upload_warp_img_div_text {
    /*text-align: right;*/
    padding-right: 2px;
    padding-top: 2px;
  }

  .upload_warp_img_div {
    position: relative;
    display: inline-block;
  }

  .imgLimit {

  }
</style>
<style>

  .edit_textarea textarea {
    max-width: 1000px;
    height: 300px !important;
    /*position: relative;*/
  }
</style>


