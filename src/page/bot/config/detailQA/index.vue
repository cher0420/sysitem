<template>
  <div class="yoy-main">
    <!--<div class="questionTitl">-->
    <!--{{ Question }}-->
    <!--</div>-->
    <div class="keywordTip">
      关键词
    </div>
    <div class="kwShow">
      {{Keyword}}
    </div>
    <div class="keywordTip">
      答案详情
    </div>
    <div class="edit_textarea">
      <el-input
        type="textarea" :disabled="true"
        v-model="Text.Answer" class="editTextarea">
      </el-input>

    </div>
    <div class="max1000">
      <span class="fontCount">{{Text.Answer.length}}/500字</span>
    </div>
    <div class="photoUp">
      <input @change="fileChange($event)" type="file" id="upload_file" multiple style="display: none"/>
      <!-- show photo -->
      <div class="upload_warp_img" v-show="Image.length!=0">

        <div class="upload_warp_img_div cc222" @click="showIph(item)" v-for="(item,index) of Image" v-if="item.Answer != '' ">
          <div class="upload_warp_img_div_top">
            <div class="upload_warp_img_div_text">
              <!-- 放大图片 -->

            </div>
          </div>
          <img :src="item.Answer">
        </div>
      </div>
      <!--<div class="imgLimit">-->
        <!--( 支持.jpg,.jpeg,.png,.gif,svg格式, 最大不超过200k , 最多3张 )-->
      <!--</div>-->


    </div>

    <!-- -->
    <el-dialog
      title="图片预览"
      :visible.sync="dialogVisible"
      width="45%"
      :before-close="handleClose">
      <div class="PreviewImgg"><img :src="PreviewImg" ></div>
      <span slot="footer" class="dialog-footer">

  </span>
    </el-dialog>

  </div>
</template>
<script>


  import {mapGetters} from 'vuex';
  import {mapActions} from 'vuex';

  import {TOKEN} from "../../../../constants/constants";
  import {getCookies} from "../../../../utils/cookie";
  import base from "../../../../host/baseUrl";
  import store from "../../../../store/index"


  export default {
    name: "Allen-EditQA",
    data() {
      return {

        PreviewImg:"", // 预览图片src
        dialogVisible:false,

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
      showIph(item){
        this.PreviewImg = item.Answer;
        this.dialogVisible = true;
            console.log(item)
      },

      getData() {
        // let query = this.$route.query;
        let detaildata = sessionStorage.getItem("detaildata"); // => 返回
      let  query =JSON.parse(detaildata) ;
      console.log("取值",query)

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
            console.log("根据关键词获取答案",msg);


            if (msg.Status == "1") {
              if (msg.Data != null) {
                // code
                that.Question = msg.Data.Question;
                that.Keyword = msg.Data.Keyword;
                that.Text = msg.Data.Text;
                that.Image = msg.Data.Image;


              }

            }

          }
        })


      },
      // 图片上传
      // fileClick() {
      //
      //   document.getElementById('upload_file').click()
      // },
      // fileChange(el) {
      //   if (!el.target.files[0].size) return;
      //   this.fileList(el.target);
      //   el.target.value = '';
      //
      //
      // },
      // getPhotoUrl() { // 上传图片到服务器并拿回地址
      //   const token = getCookies(TOKEN);
      //   let data = {};
      //   let that = this;
      //   // console.log("++++", this.imgList)
      //   let Files = this.imgList.map(product => {
      //     return {
      //       "Context": product.file.src.slice(22),
      //       "Suffix": product.file.type.slice(6),
      //     };
      //   });
      //   this.imgListNew = Files;
      //   console.log("change", this.imgListNew)
      //
      //   data = {
      //     "Id": "",
      //     "Command": "delete",
      //     "Files": Files,
      //   }
      //
      //   $.ajax({
      //     type: "POST",
      //     headers: {
      //       "Content-Type": "application/json;charset=utf-8",
      //       'Access-Token': token
      //     },
      //     url: base.requestHost + "/api/KnowledgeQA/UploadAndDeleteAsync",
      //     data: JSON.stringify(data),
      //     success: function (msg) {
      //       console.log("photo反馈", msg)
      //       if (msg.Status == "1") {
      //         let obj = {};
      //         if (msg.Data.FilesName.length == 0) {
      //           obj.Answer = msg.Data.FilesName;
      //           obj.ID = "";
      //           that.Image.push(obj);
      //         }
      //         for (var i = 0; i < msg.Data.FilesName.length; i++) {
      //           that.Image[i] = {
      //             ID: "",
      //             Answer: msg.Data.FilesName[i]
      //           }
      //         }
      //         if (msg.Data.FilesName.length == 0) {
      //           // obj.Answer = "",
      //           //   obj.ID = "";
      //           that.Image = [];
      //         }
      //         that.saveKeywords();
      //
      //         console.log("img", that.Image)
      //
      //       }
      //
      //
      //     }
      //   })
      //
      //
      // },
      // saveKeywords() {  // 	存储答案
      //
      //   console.log("存储答案userInerInfo", store.state.app.userInfo)
      //   let that = this;
      //   const token = getCookies(TOKEN);
      //   this.token = token;
      //   let recordId = JSON.parse(sessionStorage.getItem('recordId'));
      //   let TenantId = store.state.app.userInfo.TenantId;
      //   let Email = store.state.app.userInfo.Email;
      //   let FullName = store.state.app.userInfo.FullName;
      //   let data = {
      //     "BotConfigId": recordId,
      //     "TenantId": TenantId,
      //     "Question": that.Question,
      //     "Keyword": that.Keyword,
      //     "Text": {
      //       "ID": that.ID,
      //       "Answer": that.Answer,
      //     },
      //     "Image": that.Image,
      //     "Email": Email,
      //     "FullName": FullName
      //   };
      //   $.ajax({
      //     type: "POST",
      //     headers: {
      //       "Content-Type": "application/json;charset=utf-8",
      //       'Access-Token': token
      //     },
      //     url: base.requestHost + "/api/QuickQA/StoreQAData",
      //     data: JSON.stringify(data),
      //     success: function (msg) {
      //       console.log("存储答案", msg)
      //       if (msg.Status == "1") {
      //
      //         that.$message({
      //           message: '编辑答案成功',
      //           type: 'success'
      //         });
      //
      //
      //
      //         // 跳转到列表页
      //         const query = that.$route.query;
      //
      //
      //
      //
      //         that.$router.push({
      //           path: '/bot/config/quicklyQA',
      //           query:{
      //             ...query,
      //           }
      //
      //         })
      //
      //       }
      //
      //     }
      //   })
      //
      //
      // },
      // fileList(fileList) {
      //   let files = fileList.files;
      //   for (let i = 0; i < files.length; i++) {
      //     //判断是否为文件夹
      //     if (files[i].type != '') {
      //       this.fileAdd(files[i]);
      //     } else {
      //       //文件夹处理
      //       this.folders(fileList.items[i]);
      //     }
      //   }
      // },
      // //文件夹处理
      // folders(files) {
      //   let _this = this;
      //   //判断是否为原生file
      //   if (files.kind) {
      //     files = files.webkitGetAsEntry();
      //   }
      //   files.createReader().readEntries(function (file) {
      //     for (let i = 0; i < file.length; i++) {
      //       if (file[i].isFile) {
      //         _this.foldersAdd(file[i]);
      //       } else {
      //         _this.folders(file[i]);
      //       }
      //     }
      //   })
      // },
      // foldersAdd(entry) {
      //   let _this = this;
      //   entry.file(function (file) {
      //     _this.fileAdd(file)
      //   })
      // },
      // fileAdd(file) {
      //   //总大小
      //   this.size = this.size + file.size;
      //   //判断是否为图片文件
      //   if (file.type.indexOf('image') == -1) {
      //     file.src = 'wenjian.png';
      //     this.imgList.push({
      //       file
      //     });
      //   } else {
      //     let reader = new FileReader();
      //     reader.vue = this;
      //     reader.readAsDataURL(file);
      //     reader.onload = function () {
      //       file.src = this.result;
      //       this.vue.imgList.push({
      //         file
      //       });
      //     }
      //   }
      // },
      // fileDel(index) {
      //   this.size = this.size - this.imgList[index].file.size;//总大小
      //   this.imgList.splice(index, 1);
      // },
      // bytesToSize(bytes) {
      //   if (bytes === 0) return '0 B';
      //   let k = 1000, // or 1024
      //     sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
      //     i = Math.floor(Math.log(bytes) / Math.log(k));
      //   return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
      // },


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
  @import '../../../../style/index';
  /*@import "../../../../../static/base.css";*/

  .PreviewImgg {
    text-align: center;
  }
  .PreviewImgg img {
    width: 360px;
  }

  .upload_warp_img_div_text {
    width: 100%;
    height: 100%;
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
    /*position: relative;*/
  }

  .edit_textarea .fontCount {
    word-break: keep-all;
    /*position: absolute;*/
    /*right: 7px;*/
    /*bottom: 5px;*/
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
    -webkit-box-shadow: 0 0 10px #c0c4cc;
    -moz-box-shadow: 0 0 10px #c0c4cc;
    cursor: pointer;
    /*box-shadow: 0 0 10px #c0c4cc;*/
  }

  .upload_warp_img_div img {
    width: 100%;
    height: 100%;
  }

  .photoUp {
    margin-top: 22px;
    margin-left: 40px;
    position: relative;
    max-width: 1000px;
  }

  .upload_warp_img_div_text {
    text-align: right;
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


