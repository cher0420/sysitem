<template>
  <div class="mainStyle">
    <div class="oldQA">
      <div class="existingQues">
        <span>已有问题</span>
        <div class="createTime">
          创建时间 : {{CreateDate}}
        </div>
      </div>
      <div class="questionDetail">
        问题 : {{Question}}
      </div>
      <div class="existingQuestion">
        <div class="existingQues">
          已有关键词
        </div>
      </div>
      <div class="questionDetail">
        关键词 : {{Keyword}}
      </div>
      <div class="existingQuestion">
        <div class="existingQues">
          已设置答案
        </div>
      </div>
      <div class="updateTextareaa">
        <div class="answerDis">
          {{Text.Answer}}
        </div>

      </div>
      <div class="upload_warp_imgg" v-show="Image.length!=0">

        <div class="upload_warp_img_div cc222" v-for="(item,index) of Image">
          <div class="upload_warp_img_div_top">
            <div class="upload_warp_img_div_text" @click="oldFD(index)">
              <!--<i class="el-icon-zoom-in" @click="oldFD(index)"></i>-->

            </div>

          </div>
          <img :src="item.Answer" >
        </div>
      </div>
    </div>
    <div class="newQA">
      <div class="editQuestionBac">
        <div class="editQuestion">
          第一步： 添加问题
        </div>
      </div>
      <div class="questionDetail">
        问题 : {{Question}}
      </div>
      <div class="editQuestionBac">
        <div class="editQuestion">
          第二步 : 确认关键词 ( 可选择2-4个 )
        </div>
      </div>
      <div class="questionDetail">
        关键词 : {{Keyword}}
      </div>
      <div class="editQuestionBac">
        <div class="editQuestion">
          第三步 : 设置答案
        </div>
      </div>
      <div class="editAnswerQA">
        <textarea v-model="newText.Answer" placeholder="请输入自定义回答,最多500个字符"></textarea>
        <span class="fontCount">{{newText.Answer.length}}/500字</span>
      </div>
      <!-- upload photo -->
      <div class="m20">
        <div class="">
          <input @change="fileChange($event)" type="file" id="upload_file" multiple style="display: none"/>

          <!-- 传过来的图片展示-->
          <!--<div class="upload_warp_imgg" v-show="Image.length!=0">-->

            <!--<div class="upload_warp_img_div cc222" v-for="(item,index) of Image">-->
              <!--<div class="upload_warp_img_div_top">-->
                <!--<div class="upload_warp_img_div_text">-->
                  <!--<i class="el-icon-zoom-in" @click="oldFD(index)"></i>-->
                  <!--<i class="el-icon-delete" @click="OldFileDel(index)"></i>-->
                <!--</div>-->

              <!--</div>-->
              <!--<img :src="item.Answer">-->
            <!--</div>-->
          <!--</div>-->


          <!--图片展示-->
          <div class="upload_warp_imgg" v-show="imgList.length!=0">

            <div class="upload_warp_img_div cc222" v-for="(item,index) of imgList">
              <div class="upload_warp_img_div_top">
                <div class="upload_warp_img_div_text">
                  <i class="el-icon-zoom-in" @click="photoMagnify(index)"></i>
                  <i class="el-icon-delete " @click="fileDel(index)"></i>
                </div>

              </div>
              <img :src="item.file.src">
            </div>
          </div>

          <!-- 添加图片按钮 -->
          <div class="upload_warp_leftt" @click="fileClick" v-if="addIcon">
            <i class="el-icon-plus"></i>
          </div>

        </div>

      </div>

      <div class="support_format">
        ( 支持.jpg,.jpeg,.png,.gif,svg格式, 最大不超过200k , 最多3张 )
      </div>
      <div class="alterKey">
        <el-button type="primary" plain size="mini" @click="alterKeyWords()">修改关键词</el-button>
        <el-button type="primary" size="mini" @click="getPhotoUrl()">更新回答</el-button>
        <!--
        第一步拿到本地图片
        第二部上传图片到服务器
        第三步拿到图片地址并保存修改后的答案
        -->
      </div>


    </div>

    <!-- -->
    <el-dialog
      title="图片预览"
      :visible.sync="dialogVisible"
      width="45%"
      :before-close="handleClose">
      <div class="dialogg"><img :src="PreviewImg"></div>
      <span slot="footer" class="dialog-footer">
  </span>
    </el-dialog>

  </div>
</template>
<script>

  import {mapActions} from 'vuex';

  import {TOKEN} from "../../../../constants/constants";
  import {getCookies} from "../../../../utils/cookie";
  import base from "../../../../host/baseUrl";
  import store from "../../../../store/index";


  export default {
    name: "Allen-editdateQA",
    data() {
      return {
        addIcon: true, // 图片添加功能 + 是否显示

        PreviewImg: "", // 预览图片
        dialogVisible: false,
        // 图片上传
        imgList: [],
        size: 0,

        CreateDate: "",
        Image: [{
          ID: "",
          Answer: "",
        }],
        KeyId: '',
        Keyword: '',
        Question: "",
        Text: {
          ID: "", Answer: "",
        },
        newText: { // 更新的新答案
          ID: "",
          Answer: "",
        },

        DeleteIds: [], // 要删除的图片


      }
    },
    computed: {},
    components: {},

    created() {
      this.getData();
      this.checkSize();

    },

    methods: {
      ...mapActions(
        ["questionNext", "questionLast", "keywordsNext", "keywordsLast", "newDataDis",]
      ),
      getData() {

        let data = JSON.parse(sessionStorage.getItem('Data'));
        //   console.log("data111",data)

        this.CreateDate = data.CreateDate;
        this.Image = data.Image;
        this.KeyId = data.KeyId;
        this.Keyword = data.Keyword;
        this.Question = data.Question;
        if (data.Text.Answer != null) {

          this.Text = data.Text;
          const ID =  this.Text.ID;  // 更新 回答 的id
          this.newText.ID  = ID ;
        }



        //   console.log("子组件数据", data);
      },

      alterKeyWords() {
        const query = this.$route.query;
        this.$router.push({
          path: '/bot/config/quicklyQA/createrNewQA',
          query: {
            ...query,
          }
        })
        this.newDataDis(); // 展示新创建问题页面
       //this.questionNext();
      },

      // 图片上传
      fileClick() {

        document.getElementById('upload_file').click()
      },
      fileChange(el) {
        if (!el.target.files[0].size) return;
        this.fileList(el.target);
        el.target.value = '';


      },
      getPhotoUrl() { //  上传图片到服务器并拿回地址 ， 并回调保存答案
        const token = getCookies(TOKEN);
        let data = {};
        let that = this;
        // console.log("++++", this.imgList)
        let Files = this.imgList.map(product => {
          return {
            "Context": product.file.src.slice(22),
            "Suffix": product.file.type.slice(6),
          };
        });
        // this.imgListNew = Files;
        // console.log("change", this.imgListNew)

        data = {
          "Id": "",
          "Command": "upload",
          "Files": Files,
        }

        $.ajax({
          type: "POST",
          headers: {
            "Content-Type": "application/json;charset=utf-8",
            'Access-Token': token
          },
          url: base.requestHost + "/api/KnowledgeQA/UploadAndDeleteAsync",
          data: JSON.stringify(data),
          success: function (msg) {
            // console.log("photo反馈", msg)
            if (msg.Status == "1") {
              let obj = {};
              if (msg.Data.FilesName.length == 0) {
                obj.Answer = msg.Data.FilesName;
                obj.ID = "";
                that.Image.push(obj);
              }
              for (var i = 0; i < msg.Data.FilesName.length; i++) {
                that.Image[i] = {
                  ID: "",
                  Answer: msg.Data.FilesName[i]
                }
              }
              if (msg.Data.FilesName.length == 0) {
                obj.Answer = "",
                  obj.ID = "";
                that.Image.push(obj);
              }
              that.updataAnswer();

              //    console.log("img", that.Image)

            }


          }
        })


      },

      updataAnswer() { // 更新问题


        // console.log("存储答案userInerInfo", store.state.app.userInfo)
        let that = this;
        const token = getCookies(TOKEN);
        this.token = token;
        let recordId = JSON.parse(sessionStorage.getItem('recordId'));
        let TenantId = store.state.app.userInfo.TenantId;
        let Email = store.state.app.userInfo.Email;
        let FullName = store.state.app.userInfo.FullName;
        let data = {
          "BotConfigId": recordId,
          "TenantId": TenantId,
          "KeyId": that.KeyId,
          "Question": that.Question,
          "Keyword": that.Keyword,
          "Text": that.Text,
          "Image": that.Image,
          "DeleteIds": that.DeleteIds,
          "Email": Email,
          "FullName": FullName
        };
        $.ajax({
          type: "POST",
          headers: {
            "Content-Type": "application/json;charset=utf-8",
            'Access-Token': token
          },
          url: base.requestHost + "/api/QuickQA/StoreQAData",
          data: JSON.stringify(data),
          success: function (msg) {
            // console.log("存储答案", msg)
            if (msg.Status == "1") {

              that.$message({
                message: '更新新问答成功',
                type: 'success'
              });
              setTimeout(function () {
                const recordId = that.$route.query.recordId
                that.$router.push({
                  path: '/bot/config/quicklyQA',
                  query: {
                    recordId
                  }
                })
              }, 1500)

            } else {
              that.$message({
                message: '更新新问答失败',
                type: 'success'
              });
            }

          }
        })

      },


      // saveKeywords() {  // 	更新答案
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
      //     "DeleteIds": that.DeleteIds,
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
      //       console.log("存储答案1111", msg)
      //       if (msg.Status == "1") {
      //
      //         that.$message({
      //           message: '更改新问答成功',
      //           type: 'success'
      //         });
      //
      //         // 跳转到列表页
      //         const query = that.$route.query;
      //         that.$router.push({
      //           path: '/bot/config/quicklyQA',
      //           query: {
      //             ...query,
      //           }
      //         })
      //
      //       }
      //
      //     }
      //   })
      //
      //
      // },

      fileList(fileList) {
        let files = fileList.files;
        for (let i = 0; i < files.length; i++) {
          let typeImg = files[i].type.slice(0,5);
          if( typeImg != "image"){
            this.$message({
              message: '请上传规定的图片文件',
              type: 'warning'
            });
            return false;
          }


          //判断是否为文件夹

          if (files[i].type != '') {
            this.fileAdd(files[i]);
          } else {
            //文件夹处理
            this.folders(fileList.items[i]);
          }
        }
      },
      //文件夹处理
      folders(files) {
        let _this = this;
        //判断是否为原生file
        if (files.kind) {
          files = files.webkitGetAsEntry();
        }
        files.createReader().readEntries(function (file) {
          for (let i = 0; i < file.length; i++) {
            if (file[i].isFile) {
              _this.foldersAdd(file[i]);
            } else {
              _this.folders(file[i]);
            }
          }
        })
      },
      foldersAdd(entry) {
        let _this = this;
        entry.file(function (file) {
          _this.fileAdd(file)
        })
      },
      fileAdd(file) {
        console.log("daxiao",file.size/1024 )
        let currSize = file.size/1024 ;
        if(currSize > 200 ){
          this.$message({
            message: '单张图片最大不超过200k',
            type: 'warning'
          });
          return false;

        }

        //总大小
        this.size = this.size + file.size;
        //判断是否为图片文件
        if (file.type.indexOf('image') == -1) {
          file.src = 'wenjian.png';
          this.imgList.push({
            file
          });
        } else {
          let reader = new FileReader();
          reader.vue = this;
          reader.readAsDataURL(file);
          reader.onload = function () {
            file.src = this.result;
            this.vue.imgList.push({
              file
            });
          }
        }
      },
      oldFD(index){
        this.dialogVisible = true;
        this.PreviewImg = this.Image[index].Answer;
      },
      OldFileDel(index) {
        // console.log(this.Image[index]);
        this.DeleteIds.push(this.Image[index].ID); // 删除图片的id
        //  console.log( this.DeleteIds)
        this.Image.splice(index, 1);


      },
      photoMagnify(index) {
        this.dialogVisible = true;
        this.PreviewImg = this.imgList[index].file.src;
        // console.log("item", this.imgList[index].file.src)
      },
      fileDel(index) {
        this.size = this.size - this.imgList[index].file.size;//总大小
        this.imgList.splice(index, 1);
      },
      bytesToSize(bytes) {
        if (bytes === 0) return '0 B';
        let k = 1000, // or 1024
          sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
          i = Math.floor(Math.log(bytes) / Math.log(k));
        return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
      },
      checkSize() { // 计算文本域字数
        let that = this;
        this.timer = setInterval(function () {

          let count1 = that.imgList.length;
          let count2 = that.Image.length;
          let count = Number(count1) + Number(count2);

          if (2 < count) {  //  上传图片最多3张
            //  console.log("计数111",count)
            that.addIcon = false;
          } else {
            that.addIcon = true;
          }
          if (that.Text.Answer.length > 500) {  // 检查字数
            that.textarea = that.Text.Answer.toString().substr(0, 500);
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
  /*@import '../../../../style/index';*/
  /*@import "../../../../../static/base.css";*/

  .upload_warp_img_div img {
    width: 80px;
  }
  .m20 {
    margin-top: 20px;
  }

  .upload_warp_imgg {
    display: inline-block;
    vertical-align: middle;
  }

  .upload_warp_leftt {
    display: inline-block;
    width: 80px;
    height: 80px;
    border: 1px dashed #c3c3c3;
    font-size: 30px;
    color: #c3c3ce;
    line-height: 80px;
    text-align: center;
    vertical-align: middle;
    display: inline-block;
    margin-right: 22px;
    vert-align: middle;
  }

  .upload_warp_leftt:hover {
    border-color: #409eff;
    color: #409eff;
    cursor: pointer;
  }

  .editQuestion {
    color: #555;
    font-size: 16px;
    height: 30px;
    line-height: 30px;

    /*width: 100%;*/
    padding-left: 10px;
  }

  .editQuestionBac {
    background: #F9FAFC;
    /*width: 100%;*/
  }

  .mainStyle {
    font-size: 12px;
    color: #999;
    font-family: "Microsoft YaHei";
    /*width: 100%;*/
    /*height: 100%;*/
    line-height: 1;
    position: relative;
    padding-left: 543px;

    /*overflow: hidden;*/
  }

  .answerDis {
    box-sizing: border-box;
    width: 450px;
    height: 300px;
    border: 1px solid #e1e1e1;

    padding: 20px;
  }

  .oldQA {

    padding-right: 50px;
    border-right: 1px solid #F9FAFC;
    position: absolute;
    left: 0;
    top: 0px;

  }

  .newQA {

    vertical-align: top;
    padding-left: 50px;
    box-sizing: border-box;
  }

  .createTime {
    /*display: inline-block;*/
    font-size: 12px;
    height: 30px;
    line-height: 30px;
    color: #999;
    padding-right: 10px;
    max-width: 250px;
    text-align: right;
    position: absolute;
    right: 0;
    top: 0;
  }

  .existingQues {
    color: #555;
    font-size: 16px;
    height: 30px;
    line-height: 30px;
    background: #F9FAFC;
    padding-left: 10px;
    max-width: 490px;
    position: relative;
  }

  .questionDetail {
    font-size: 14px;
    color: #555;
    padding-left: 32px;
    padding-top: 30px;
    padding-bottom: 40px;

  }

  .updataQuestions {
    padding-left: 0;
  }

  .nextStep {
    padding-bottom: 15px;
    text-align: right;
  }

  .nextStep button {
    width: 100px;
    text-align: center;
    height: 32px;
    line-height: 32px;
    padding: 0;
  }

  .support_format {
    margin-top: 15px;
    padding-bottom: 30px;

  }
</style>

<style>
  .verli {
    vertical-align: middle;
  }

  .updateTextareaa textarea {
    width: 450px;
    height: 300px !important;
    color: #999;
  }

  .updateTextareaa {
    padding-top: 30px;
    /*padding-left: 32px;*/
    position: relative;
    padding-bottom: 30px;
  }

</style>

<style scoped>

  .upload_warp_left {
    width: 80px;
    height: 80px;
    border: 1px dashed #c3c3c3;
    font-size: 30px;
    color: #c3c3ce;
    line-height: 80px;
    text-align: center;
    float: left;
    /*vert-align: middle;*/
    margin-right: 22px;
  }

  .upload_warp_img_div {
    /*display: inline-block;*/
    width: 80px;
    height: 80px;
    /*border: 1px solid red;*/
    /*margin-left: 22px;*/
    margin-right: 22px;
    /*vert-align: middle;*/
    position: relative;
    float: left;
  }

    .upload_warp_img_div  img {
      width: 80px;
    }

  .upload_warp_img {
    display: inline-block;

  }

  .photoUp {
    text-align: left;
    position: relative;
  }

  .upload_warp_img_div_text span {

    /*display: inline-block;*/
    /*height: 16px;*/
    /*line-height: 16px;*/
  }

  .upload_warp_img_div_text i {
    /*cursor: pointer;*/
    /*position: absolute;*/
    /*right: 5px;*/
    /*top: 3px;*/

  }

  .alterKey {
    text-align: right;
    max-width: 500px;
  }
</style>
<style>
  .editAnswerQA {
    position: relative;

  }

  .editAnswerQA textarea {
    box-sizing: border-box;
    width: 450px !important;
    height: 300px !important;
    margin-top: 30px;
    padding: 20px;
    border: 1px solid #e1e1e1;

  }

  .editAnswerQA .fontCount {
    position: absolute;
    left: 390px;
    bottom: 10px;
    word-break: keep-all;
    color: #999;
  }
</style>
<style scoped>
  /*  上传图片 */
  .upload_warp_img_div {
    box-sizing: border-box;
    position: relative;
  }

  .upload_warp_img_div_top {
    position: absolute;
    left: 0;
    top: 0;
    height: 80px;
    width: 100%;
    line-height: 80px;
    color: transparent;
  }

  .upload_warp_img_div_top :hover {
    background: rgba(0, 0, 0, 0.4);
    cursor: pointer;
    color: #fff;
    /*height: 80px;*/
  }

  .upload_warp_img_div_text {
    box-sizing: border-box;
    height:80px;
    line-height: 80px;
    text-align: center;
   vertical-align:middle ;
    /*padding-top: 30px;*/
    /*display: inline-block;*/

  }
  .upload_warp_img_div_text *{
    display: inline-block;
    vertical-align: middle;

  }

  .upload_warp_img_div_text .el-icon-zoom-in {
    /*height: 100%;*/
    /*line-height: 100%;*/
    /*vertical-align: middle;*/
    /*display: inline-block;*/
    /*text-align: center;*/
  }
  .upload_warp_img_div_text i {
    /*vert-align: middle;*/
    /*display: inline-block;*/
    font-size: 20px;
    /*height: 100%;*/
  }

  .upload_warp_img_div_text .el-icon-delete {
    /*height: 100%;*/
    /*!*line-height: 100%;*!*/
    /*vertical-align: middle;*/
    /*display: inline-block;*/
  }

  .dialogg{
    /*width: 360px;*/
  text-align: center;
  }
  .dialogg img {
    width: 360px;
  }
</style>
