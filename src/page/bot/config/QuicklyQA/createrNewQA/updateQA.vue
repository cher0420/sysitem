<template>
  <!--<div class="mainStyle" v-loading="loadingEdit">-->
  <el-row class="mainStyle">
    <el-col :span="12">
      <div class="oldQA">
        <div class="existingQues">
          <span>已有问题</span>
          <div class="createTime">
            创建时间 ： {{ CreateDate}}
          </div>
        </div>
        <div class="questionDetail box-sizing" :style="{height:questionHeight}" id="quickQuizQuestionAlready">
          问题 ： {{Question}}
        </div>
        <div class="existingQuestion">
          <div class="existingQues">
            已有关键词
          </div>
        </div>
        <div class="questionDetail box-sizing" :style="{height:keyWordsHeight}" id="quickQuizKeyWordsAlready">
          关键词 ： {{Keyword}}
        </div>
        <div class="existingQuestion">
          <div class="existingQues">
            已设置答案
          </div>
        </div>
        <div class="updateTextareaa">
          <div class="editAnswerQA">
            <div class="leftView" v-html="Text.Answer">
            </div>
          </div>
        </div>
        <div class="upload_warp_imgg" v-show="Image.length!=0">
          <div class="upload_warp_img_div cc222" v-for="(item,index) of Image">
            <div class="upload_warp_img_div_top">
              <div class="upload_warp_img_div_text" @click="oldFD(index)">
                <i class="el-icon-zoom-in"></i>
              </div>
            </div>
            <img :src="item.Answer">
          </div>
        </div>

      </div>
    </el-col>
    <el-col :span="12">
      <div class="newQA">
        <div class="editQuestionBac">
          <div class="editQuestion">
            第一步： 添加问题
          </div>
        </div>
        <div class="questionDetail box-sizing" :style="{height:questionHeight}" id="quickQuizQuestionNew">
          问题 ： {{QuestionNew}}
        </div>
        <div class="editQuestionBac">
          <div class="editQuestion">
            第二步 ： 确认关键词 ( 可选择2-4个 )
          </div>
        </div>
        <div class="questionDetail box-sizing" :style="{height:keyWordsHeight}" id="quickQuizKeyWordsNew">
          关键词 ： {{Keyword}}
        </div>
        <div class="editQuestionBac">
          <div class="editQuestion">
            第三步 ： 设置答案
          </div>
        </div>
        <div class="editAnswerQA">
          <textarea maxlength="500" v-model="newText.Answer" placeholder="请输入自定义回答,最多500个字符"></textarea>
          <span class="fontCount">{{newText.Answer.length}}/500字</span>
        </div>
        <div class="m16">
          <div class=""><input @change="fileChange($event)" type="file" id="upload_file" multiple
                               style="display: none"/>
            <div class="upload_warp_imgg photoView" v-show="imgList.length!=0">
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
            <div class="upload_warp_leftt" @click="fileClick" v-show="imgList.length<3">
              <i class="el-icon-plus"></i>
            </div>

          </div>

        </div>

        <div class="support_format">
          （至多上传3张，每张不超过200K，支持jpg、jpeg、png、gif格式）
        </div>
        <div class="alterKey">
          <el-button plain size="small" @click="alterKeyWords()">修改关键词</el-button>
          <el-button type="primary" size="small" @click="getPhotoUrl()" v-if="loader">更新回答</el-button>
          <el-button type="primary" size="small" :loading="!loader" v-if="!loader">更新中...</el-button>


        </div>

      </div>

    </el-col>
    <el-dialog
      title="图片预览"
      :visible.sync="dialogVisible"
      width="45%"
      :before-close="handleClose">
      <div class="dialogg"><img :src="PreviewImg"></div>
      <span slot="footer" class="dialog-footer">
  </span>
    </el-dialog>
  </el-row>


  <!-- -->


  <!--</div>-->
</template>
<script>

  import {mapActions} from 'vuex';
  import {TOKEN} from "../../../../../constants/constants";
  import {getCookies} from "../../../../../utils/cookie";
  import base from "../../../../../host/baseUrl";
  import store from "../../../../../store/index";
  import moment from 'moment'
  import {UploadAndDeleteAsync} from "../../../../../api/getdata";  //  异步请求
  import { IMG_UPLOADORDELETE,GETKEYWORDS,QUERYQADATA } from "../../../../../constants/api";

  export default {
    name: "editdatem",
    data() {
      return {
        loadingEdit: false,
        loader: true, // 更新提交
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
        ImageNew: [],
        KeyId: '',
        Keyword: '',
        Question: "",
        QuestionNew: "",
        Text: {
          ID: "", Answer: "",
        },
        newText: { // 更新的新答案
          ID: "",
          Answer: "",
        },

        DeleteIds: [], // 要删除的图片
        DeleteAnswers: [],
        questionHeight: 21,
        keyWordsHeight: 21,
      }
    },
    computed: {},
    components: {},

    created() {
      this.getData();
      this.checkSize(); // 文本域计数

    },
    mounted() {
      let that = this;
      this.resetHeight('quickQuizQuestionAlready', 'quickQuizQuestionNew', 'questionHeight')
      this.resetHeight('quickQuizKeyWordsAlready', 'quickQuizKeyWordsNew', 'keyWordsHeight');
      // this.myResizee();
    //  console.log(that.formatDateTime(that.CreateDate))
    },

    methods: {
      ...mapActions(
        ["questionNext", "questionLast", "keywordsNext", "keywordsLast", "newDataDis",]
      ),
      // formatDateTime() {
      //   let time = this.CreateDate;
      //   let m = moment(time).format('YY-MM-DD')
      //   return m;
      // },

      myResizee() {
        console.log("触发UUUUUU")
        let robotWidthH = $(".robotWidth").outerHeight(true);
        // console.log("all",robotWidthH);
        let navBarH = $(".navBar").outerHeight(true);
        // console.log("001",navBarH);
        let listItem = $(".listItem").outerHeight(true);
        // console.log("002",listItem);
        let sum = navBarH + listItem;

        $(".robotFoot").css({
          "position": "static",
          "left": "0",
          "bottom": "0px",
          "z-index": "9"
        })


        // console.log(robotWidthH)
      },
      resetHeight(el1, el2, value) {
        const elAlreadyHeight = document.getElementById(el1).offsetHeight
        const elNewHeight = document.getElementById(el2).offsetHeight
        this[value] = Math.max(elAlreadyHeight, elNewHeight) + 'px'

      },
      getData() {

        let data = JSON.parse(sessionStorage.getItem('Data'));
        let QuestionNew = JSON.parse(sessionStorage.getItem('Question'));
        // console.log("******",QuestionNew)
        // debugger;
        this.CreateDate = moment(data.CreateDate).format('YYYY.MM.DD HH:mm');
        this.Image = data.Image;
        this.KeyId = data.KeyId;
        this.Keyword = data.Keyword.replace(/,/g, '、');
        this.Question = data.Question;
        this.QuestionNew = QuestionNew;
        if (data.Text.Answer != null) {
          this.Text = data.Text;
          this.Text.Answer = this.Text.Answer.replace(/\n+/g, "<br/>")
          const ID = this.Text.ID;  // 更新 回答 的id
          this.newText.ID = ID;
        }
        let DeleteIdsRec = this.Image.map(function (item) {
          return item.ID;
        });

        this.DeleteIds = DeleteIdsRec
        this.DeleteAnswers = this.Image.map(function (item) {
          return item.Answer;
        });

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
        let thatt = this;
        this.$confirm('是否要更改答案?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          thatt.loadingEdit = true;
          this.loader = false;
          const token = getCookies(TOKEN);
          let data = {};
          let that = this;

          let Files = this.imgList.map(product => {

            if (product.file.type.slice(6) == "svg+xml") {
              return {
                "Context": product.file.src.slice(26),
                "Suffix": product.file.type.slice(6),
              };
            }
            return {
              "Context": product.file.src.slice(22),
              "Suffix": product.file.type.slice(6),
            };
          });
          let recordId = JSON.parse(sessionStorage.getItem('recordId'));
          data = {
            "Id": recordId,
            "Command": "upload",
            "Files": Files,
          };

          $.ajax({
            type: "POST",
            headers: {
              "Content-Type": "application/json;charset=utf-8",
              'Access-Token': token
            },
            url: base.requestHost + IMG_UPLOADORDELETE ,
            data: JSON.stringify(data),
            success: function (msg) {
              // console.log("photo反馈", msg)
              if (msg.Status == "1") {
                if (msg.Data.FilesName.length != 0) {
                  for (var i = 0; i < msg.Data.FilesName.length; i++) {
                    that.ImageNew[i] = {
                      ID: "",
                      Answer: msg.Data.FilesName[i]
                    }
                  }
                }
                that.updataAnswerr();
              }
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消更改'
          });
        });
      },

      updataAnswerr() {   // 更新问题


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
          "Keyword": that.Keyword.replace(/、/g, ','),
          "Text": that.newText,
          "Image": that.ImageNew,
          "DeleteIds": that.DeleteIds,
          "Email": Email,
          "FullName": FullName
        };

        if (this.newText.Answer.indexOf("<") != "-1" || this.newText.Answer.indexOf(">") != "-1" || this.newText.Answer.indexOf("&") != "-1" || this.newText.Answer.indexOf("$") != "-1" || this.newText.Answer.indexOf("%") != "-1") {

          this.$message({
            message: '<> $ & % 为敏感字符，请勿添加在答案中',
            type: 'warning'
          });
          this.loader = true;
          this.loadingEdit = false;
          return false;
        }


        if (that.newText.Answer.trim() == "" && that.ImageNew.length == 0) {
          console.log("答案不能为空")
          that.$message({
            message: '答案不能为空',
            type: 'warning'
          });
          that.loadingEdit = false;

          that.loader = true;
          return false
        }

        $.ajax({
          type: "POST",
          headers: {
            "Content-Type": "application/json;charset=utf-8",
            'Access-Token': token
          },
          url: base.requestHost + STOREQADATA ,
          data: JSON.stringify(data),
          success: function (msg) {

            this.loader = true;
            // console.log("存储答案", msg)
            if (msg.Status == "1") {

              that.delPhoto();// 删除已上传图片
              that.$message({
                message: '更新新问答成功',
                type: 'success'
              });
              // setTimeout(function () {
              //   that.loadingEdit = false;
              // },1000)

              setTimeout(function () {

                const recordId = that.$route.query.recordId
                that.$router.push({
                  path: '/bot/config/quicklyQA',
                  query: {
                    recordId
                  }
                })
                that.loadingEdit = false;

              }, 1500)

            } else {
              that.$message({
                message: '更新新问答失败',
                type: 'success'
              });
              that.loadingEdit = false;
            }

          }
        })

      },

      async delPhoto() {

        let files = this.DeleteAnswers.map(function (item) {
          let index = item.lastIndexOf(".");
          let Suffix = item.substring(index + 1)
          return {
            "Context": item,
            "Suffix": Suffix

          }
        })
        let recordId = JSON.parse(sessionStorage.getItem('recordId'));
        let data = {
          "Id": recordId,
          "Command": "delete",
          "Files": files,

        };

        let result = await UploadAndDeleteAsync(data)
        console.log("图片从数据库删除", result)
        // debugger;

      },


      fileList(fileList) {
        let files = fileList.files;
        for (let i = 0; i < files.length; i++) {
          let typeImg = files[i].type.slice(0, 5);
          if (typeImg != "image") {
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
        // console.log("daxiao", file.size / 1024)
        let currSize = file.size / 1024;


        if (file.type == "image/svg+xml") {

          this.$message({
            message: '添加失败，上传图片类型不合法',
            type: 'warning'
          });

          return false;
        }


        if (currSize > 200) {
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
      oldFD(index) {
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
        this.$confirm('确认要删除此图片?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.size = this.size - this.imgList[index].file.size;//总大小
          this.imgList.splice(index, 1);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
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
          // let count2 = that.Image.length;
          // let count = Number(count1) + Number(count2);
          let count = Number(count1);
          if (2 < count) {  //  上传图片最多3张
            //  console.log("计数111",count)
            that.addIcon = false;
          } else {
            that.addIcon = true;
          }


          if (that.newText.Answer.length > 500) {  // 检查字数
            that.newText.Answer = that.newText.Answer.toString().substr(0, 500);
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

  .m16 {
    margin-top: 16px;
  }

  .upload_warp_imgg {
    display: inline-block;
    vertical-align: middle;
    margin-left: 40px;
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
    margin-right: 20px;
    vert-align: middle;
    border-radius: 6px;
    background-color: #fbfdff;
  }

  .upload_warp_leftt:hover {
    border-color: #409eff;
    color: #409eff;
    cursor: pointer;
  }
  .upload_warp_leftt:focus {
    border-color: #409eff;
    color: #409eff;
    cursor: pointer;
  }

  .editQuestion {
    color: #555;
    font-size: 16px;
    height: 30px;
    line-height: 30px;
    max-width: 400px;
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
    /*line-height: 1;*/
    /*position: relative;*/
    /*padding-left: 543px;*/

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
    /*position: absolute;*/
    /*left: 0;*/
    /*top: 0px;*/

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
    position: relative;
  }

  .questionDetail {
    font-size: 14px;
    color: #555;
    padding-left: 32px;
    padding-top: 30px;
    padding-bottom: 40px;
    word-break: break-all;
    word-wrap: break-word;
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
    padding-left: 40px;
    /*padding-top: 30px;*/
    /*padding-left: 32px;*/
    position: relative;
    padding-bottom: 20px;
  }

</style>

<style scoped lang="scss">
  /*@import '../../../../../style/index';*/
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
    margin-right: 20px;
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

  .upload_warp_img_div img {
    width: 80px;
    height: 100%;
    -webkit-border-radius: 6px;
    -moz-border-radius: 6px;
    border-radius: 6px;
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
    /*text-align: right;*/
    max-width: 450px;
    margin-top: 20px;
    padding-bottom: 3px;
  }

  .alterKey button {
    width: 100px;
    padding: 0px;
    height: 32px;
    line-height: 32px;
    text-align: center;
  }

  .alterKey button {
    width: 100px;
    padding: 0px;
    height: 32px;
    line-height: 32px;
    text-align: center;
  }

  .alterKey button:nth-child(1) {
    border: 1px solid #2a8ce7;
    color: #2a8ce7;
  }
</style>
<style>
  .editAnswerQA {
    position: relative;
  }

  .photoView {
    margin-left: 0 !important;
  }

  .editAnswerQA {
    /*max-width: 450px;*/
  }

  .editAnswerQA textarea {
    color: #999;
    font-size: 14px;
    margin-top: 30px;
    box-sizing: border-box;
    width: 100% !important;
    height: 300px !important;
    padding: 20px;
    /*border: 1px solid #e1e1e1;*/
    /*border: transparent;*/
    outline: none;
    resize: none;

  }

  .editAnswerQA textarea:hover {
    border: 1px solid #2A8CE7;
  }
  .editAnswerQA textarea:focus {
    border: 1px solid #2A8CE7;
  }

  .editAnswerQA .leftView {
    color: #999;
    font-size: 14px;
    margin-top: 30px;
    box-sizing: border-box;
    /*width: 450px !important;*/
    height: 300px !important;
    padding: 20px;
    outline: none;
    resize: none;
    border: 1px solid #999;
    overflow: scroll;
  }

  .editAnswerQA .leftView:hover {
    border: 1px solid #2A8CE7;
  }
  .editAnswerQA .leftView:focus {
    border: 1px solid #2A8CE7;
  }

  .editAnswerQA .fontCount {
    position: absolute;
    /*left: 385px;*/
    right: 10px;
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
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    width: 80px;
    height: 100%;
    /*text-align: center;*/
    line-height: 80px;
    color: transparent;
    text-align: left;
    border: 1px solid #c0ccda;
    -webkit-border-radius: 6px;
    -moz-border-radius: 6px;
    border-radius: 6px;
  }

  .upload_warp_img_div_text:hover {
    background: rgba(0, 0, 0, 0.4);
    cursor: pointer;
    color: #fff;
    border-radius: 6px;
    /*height: 80px;*/
  }

  .upload_warp_img_div_text {
    box-sizing: border-box;
    height: 80px;
    line-height: 80px;
    text-align: center;
    vertical-align: middle;
    /*padding-top: 30px;*/
    /*display: inline-block;*/

  }

  .upload_warp_img_div_text * {
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

  .dialogg {
    /*width: 360px;*/
    text-align: center;
  }

  .dialogg img {
    width: 360px;
  }
</style>
