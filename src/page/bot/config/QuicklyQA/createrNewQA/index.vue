<template>
  <div class="cc creatNewQA">
    <div v-if="newDataDis" v-loading="loadingEdit">
      <div class="addQuestion">
        第一步 ： 添加问题
      </div>
      <div v-if="questionDis">
        <div class="addContent">
          <el-input ref="input" v-model="Question" placeholder="例如:2018年年会举办地点"
                    @keyup.enter.native="getKeywords"></el-input>
        </div>
        <div class="questionTit">
          请用最简洁的方式描述你的问题
        </div>
        <div class="nextStepTop">
          <el-button type="primary" size="small" @click="getKeywords" v-if="!loading" >下一步</el-button>
          <el-button type="primary" size="small" v-if="loading" :disabled="loading" :loading="loading">下一步</el-button>
        </div>
      </div>
      <div class="addContent addContentDis" v-if="!questionDis">
        问题 ： {{Question}}
      </div>
      <div v-if="!questionDis">
        <div class="addQuestion">
          第二步 ： 确认关键词 ( 可选择2-4个 )
        </div>
        <div v-if="keywordsDis">
          <div class="keywords">
            <el-checkbox-group v-model="keywords" :min="0"
                               :max="4">
              <div class="checkboxContent" v-for="item in keywordsOption" :key="item" :title="item">
                <el-checkbox :label="item" name="keywords"></el-checkbox>
              </div>
            </el-checkbox-group>

          </div>
          <div class="checkboxContent yourselfKeyword" v-if="yourselfStatus" @click="selfShow()">
            <i class="el-icon-circle-plus"></i> <span>自定义</span>
          </div>
          <div class="yourselfInput" v-show="!yourselfStatus">
            <el-input v-model="addKey" id="focus" ref="self" v-on:blur="yourmethod" @keyup.enter.native="addKeywords()">
            </el-input>
            <i class="clickBtn el-icon-circle-plus" @click="addKeywords()"></i>
          </div>

          <div class="nextStepp mt30">
            <el-button  plain size="small" class="nextSteppButton" @click="stepOne()">上一步</el-button><el-button type="primary" size="small" @click="getCheckKeywords()" :disabled="checkboxDisabled">
            下一步
          </el-button>

          </div>
        </div>
        <div class="addContent addContentDis" v-if="!keywordsDis">
          关键词 ： {{keywordsNew}}
        </div>
        <div v-if="!keywordsDis">
          <div class="addQuestion">
            第三步： 设置答案
          </div>
          <div class="CreateNewQAtextareaParentAdd">
            <textarea v-model="textarea" placeholder="请输入自定义回答,最多500个字符" maxlength="500"></textarea>
            <span class="fontCount">{{textarea.length}}/500字</span>
          </div>

          <div class="nextStep">
            <div class="photoUp">
              <input @change="fileChange($event)" type="file" id="upload_file" multiple style="display: none"/>
              <div class="upload_warp_img" v-show="imgList.length!=0">
                <!-- li -->
                <div class="upload_warp_img_div " v-for="(item,index) of imgList">
                  <div class="upload_warp_img_div_top">

                    <div class="upload_warp_img_div_text">
                      <!-- 放大图片 -->
                      <i class="el-icon-zoom-in" @click="photoMagnify(index)"></i>
                      <i class="el-icon-delete" @click="fileDel(index)"></i>
                    </div>

                  </div>
                  <img :src="item.file.src">
                </div>
              </div>

              <div class="upload_warp_left" @click="fileClick" v-if="addIcon">
                <i class="el-icon-plus"></i>
              </div>
              <div class="imgLimit">
                （至多上传3张，每张不超过200K，支持jpg、jpeg、png、gif格式）
              </div>
            </div>

            <div style="text-align: left;margin-top: 50px;" class="nextStepp">
              <el-button  plain size="small" class="nextSteppButton" @click="keywordsLast" >上一步
              </el-button><el-button type="primary" size="small" @click="getPhotoUrl" v-if="loader">完成</el-button> <el-button type="primary" size="small" :loading="!loader" v-if="!loader">提交中...</el-button>


            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!newDataDis">
      <updateQA></updateQA>
    </div>

    <!-- -->
    <el-dialog
      title="图片预览"
      :visible.sync="dialogVisible"
      width="45%"
      :before-close="handleClose">
      <div class="photoPre"><img :src="PreviewImg"></div>
      <span slot="footer" class="dialog-footer">
  </span>
    </el-dialog>
  </div>
</template>
<script>

  import updateQA from "./updateQA";
  import {mapState, mapGetters, mapActions} from 'vuex';
  import {TOKEN} from "../../../../../constants/constants";
  import {getCookies} from "../../../../../utils/cookie";
  import base from "../../../../../host/baseUrl";
  import store from "../../../../../store/index"
  import {participle} from "../../../../../api/getdata";  // api

  export default {
    name: "Allen-CreateNewQA",
    data() {
      return {
        loadingEdit: false,
        focusState: false, // 自动获取焦点
        loader: true,  // 提交状态
        addKey: "",
        keywords: [], // 选中的关键字
        keywordsOption: [], // 关键词
        PreviewImg: "", // 预览图片
        dialogVisible: false,
        addIcon: true,
        loading: false,

        Question: "", // 题目
        textarea: "",
        timer: "",
        checkboxDisabled: true,
        token: "",
        // 图片上传
        imgList: [],
        size: 0,
        imgListNew: [],
        Image: []

      }
    },
    computed: {
      ...mapGetters([
        'questionDis',  // 问题可修改展示
        'keywordsDis',  // 关键词可修改展示
        "newDataDis",
        "yourselfStatus",
      ]),
      keywordsNew() {
        return this.keywords.join("、"); //  关键词拼接展示
      },


    },
    components: {
      updateQA
    },

    created() {


      this.init();  // 页面初始化


    },
    mounted() {
      this.$refs['input'].focus();


    },
    watch: {
      keywords(curVal, oldVal) {
        if (1 < curVal.length && curVal.length < 5) {
          this.checkboxDisabled = false;
          return false;
        }
        this.checkboxDisabled = true;

      },
      imgList(curVal, oldVal) {
        if (2 < curVal.length) {
          this.addIcon = false;
        } else {
          this.addIcon = true;
        }
      },
    },

    methods: {
      ...mapActions(
        ["yourselfStatusLast", "yourselfStatusAdd", "questionNext", "questionLast", "keywordsNext", "keywordsLast", "newDataHid"]
      ),
      stepOne() { // 上一步
        this.addKey = "";
        this.questionLast();
      },
      yourmethod() {  // 失去焦点
        let that = this;
        setTimeout(function () {
          that.yourselfStatusLast();
          that.yourselfStatusLast();
        }, 300)

        // console.log(2222222222)
      },

      init() {


        this.keywordsLast();
        this.questionLast();


      },
      selfShow() {
        let that = this;
        this.yourselfStatusAdd();  // 自定义输入框显示

        setTimeout(function () {
          that.$refs['self'].focus();
          // $("#focus").val("eeeeeeee")
        }, 200)
      },

      addKeywords() {
        let that = this;
        that.addKey = that.addKey.trim();
        //   console.log("+++++++++++");

        if (that.keywords.length < 4) {
          if (that.addKey.trim() == "") {
            that.$message({
              message: '添加关键词不能为空',
              type: 'warning'
            });
            return false;
          }
          if (that.keywordsOption.indexOf(that.addKey.trim()) != "-1") {
            that.$message({
              message: '不可以重复添加关键词',
              type: 'warning'
            });
            return false;
          }

          that.keywordsOption.push(that.addKey);
          that.keywords.push(that.addKey);
          that.yourselfStatusLast();
          that.addKey = "";
        } else {
          that.yourselfStatusLast();
          that.$message({
            message: '您选中的关键词不能超过4个，无法再添加',
            type: 'warning'
          });

          that.addKey = "";
          return false;


        }

      },

      async getKeywords() {  //  第二步 将一句话分成多个词汇

        let that = this;
        const token = getCookies(TOKEN);

        if (this.Question == "") {
          that.$message('请输入一个有效的问题');
          return false;
        }
        // 加载中
        this.loading = true;


        let data = {
          "Question": this.Question
        };


        try {
          let test = await participle(data); // 测试
          console.log("participle+++", test);

        } catch (err) {
          console.log(err)
        }


        //  debugger;

        $.ajax({
          type: "POST",
          headers: {
            "Content-Type": "application/json;charset=utf-8",
            'Access-Token': token
          },
          url: base.requestHost + "/api/QuickQA/GetKeyWords",
          data: JSON.stringify(data),
          success: function (msg) {
            that.loading = false;


            if (msg.Status == "1") {
              that.keywords = [];
              msg.Data = that.uniq(msg.Data);  // 数组去重


              if (msg.Data.length < 2) {
                setTimeout(function () {
                  that.init();
                }, 50)


                that.$message('请输入一个有效的问题');
                // that.keywordsLast();


              }


              if (msg.Data.length > 1) {

                that.keywordsOption = msg.Data;


                that.questionNext();
              }
              // console.log("msg", msg)


            }

          }
        })


      },
      uniq(array) {
        var temp = []; //一个新的临时数组
        for (var i = 0; i < array.length; i++) {
          if (temp.indexOf(array[i]) == -1) {
            temp.push(array[i]);
          }
        }
        return temp;
      },
      getCheckKeywords() {  // 第三步 	根据关键字确定 创建答案 或 更新答案


        let that = this;
        const token = getCookies(TOKEN);
        let recordId = JSON.parse(sessionStorage.getItem('recordId'));
        // console.log("recordId",recordId)
        let data = {
          "BotConfigId": recordId,
          "Keys": this.keywordsNew.replace(/、/g,',')
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
            //  console.log("debugger", msg)
            // console.log("根据关键字获取答案", msg)
            if (msg.Status == "1") {
              // 修改答案

              if (msg.Data == null) {

                that.keywordsNext(that.keywords.length);
              }
              if (msg.Data != null) {

                that.newDataHid();
                //  console.log("+++++++++++++++")
                //   that.questionLast();

                //   跳到 更新组件展示


                sessionStorage.setItem('Question', JSON.stringify(that.Question));  //  属性传参到子组件
                sessionStorage.setItem('Data', JSON.stringify(msg.Data));  //  属性传参到子组件


              }

            }

          }
        })


      },
      saveKeywords() {  // 	存储 新创建的答案
    debugger;
        //  console.log("存储答案userInerInfo", store.state.app.userInfo)
        let that = this;
        const token = getCookies(TOKEN);
        this.token = token;
        let recordId = JSON.parse(sessionStorage.getItem('recordId'));
        let TenantId = store.state.app.userInfo.TenantId;
        let Email = store.state.app.userInfo.Email;
        let FullName = store.state.app.userInfo.FullName;

        if (this.textarea.indexOf("<") != "-1" || this.textarea.indexOf(">") != "-1" || this.textarea.indexOf("&") != "-1" || this.textarea.indexOf("$") != "-1" || this.textarea.indexOf("%") != "-1") {

          this.$message({
            message: '<> $ & % 为敏感字符，请勿添加在答案中',
            type: 'warning'
          });
          this.loader = true;
          this.loadingEdit = false;
          return false;
        }

        let data = {
          "BotConfigId": recordId,
          "TenantId": TenantId,
          "Question": that.Question,
          "Keyword": this.keywordsNew.replace(/、/g,','),
          "Text": {
            "ID": "",
            "Answer": this.textarea,
          },
          "Image": that.Image,
          "Email": Email,
          "FullName": FullName
        };

        if (that.textarea.trim() == "" && that.Image.length == 0) {
          console.log("答案不能为空")
          this.loadingEdit = false;
          that.$message({
            message: '答案不能为空',
            type: 'warning'
          });

          that.loader = true;
          return false
        }


        $.ajax({
          type: "POST",
          headers: {
            "Content-Type": "application/json;charset=utf-8",
            'Access-Token': token
          },
          url: base.requestHost + "/api/QuickQA/StoreQAData",
          data: JSON.stringify(data),
          success: function (msg) {

            this.loader = true;

            //  console.log("存储答案", msg)
            if (msg.Status == "1") {

              that.$message({
                message: '创建新问答成功',
                type: 'success'
              });

              setTimeout(function () {
                that.keywordsLast();
                that.questionLast();
              }, 1000)


              // 跳转到列表页
              const query = that.$route.query;
              that.$router.push({
                path: '/bot/config/quicklyQA',
                query: {
                  ...query,
                }


              });
              setTimeout(function () {
                that.loadingEdit = false;
              }, 1000);


            }

          }
        })


      },

      //  从本地拿到图片 ，转64码
      fileClick() {
        document.getElementById('upload_file').click()
      },
      fileChange(el) {
        if (!el.target.files[0].size) return;
        this.fileList(el.target);
        el.target.value = '';


      },
      getPhotoUrl() { // 上传图片到服务器并拿回地址
        this.loadingEdit = true;
        this.loader = false;
        const token = getCookies(TOKEN);
        let data = {};
        let that = this;


        let Files = this.imgList.map(product => {
          if (product.file.type.slice(6) == "svg+xml") {
            return {
              "Context": product.file.src.slice(26),
              "Suffix": "svg",
            };
          }
          return {
            "Context": product.file.src.slice(22),
            "Suffix": product.file.type.slice(6),
          };


        });
        // debugger;
        this.imgListNew = Files;
        //   console.log("change", this.imgListNew)
        let recordId = JSON.parse(sessionStorage.getItem('recordId'));
        data = {
          "Id": recordId,
          "Command": "upload",
          "Files": Files,
        }


        // debugger;

        $.ajax({
          type: "POST",
          headers: {
            "Content-Type": "application/json;charset=utf-8",
            'Access-Token': token
          },
          url: base.requestHost + "/api/KnowledgeQA/UploadAndDeleteAsync",
          data: JSON.stringify(data),
          success: function (msg) {
            //         console.log("photo反馈", msg)
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
                // obj.Answer = "",
                //   obj.ID = "";
                that.Image = [];
              }
              that.saveKeywords();

              //     console.log("img", that.Image)

            }


          }
        })


      },
      fileList(fileList) {  // 暂时无用
        let files = fileList.files;
        for (let i = 0; i < files.length; i++) {
          //判断是否为文件夹
          let typeImg = files[i].type.slice(0, 5);
          if (typeImg != "image") {
            this.$message({
              message: '请上传规定的图片文件',
              type: 'warning'
            });
            return false;
          }

          //    console.log("类型", typeImg)
          if (files[i].type != '') {
            this.fileAdd(files[i]);
          } else {
            //文件夹处理
            this.folders(fileList.items[i]);
          }
        }
      },
      //文件夹处理
      folders(files) {   // 暂时无用
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
        //  console.log("daxiao", file.size / 1024)
        let currSize = file.size / 1024;
        if (currSize > 200) {
          this.$message({
            message: '添加失败，单张图片最大不超过200k',
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
        } else {  // 图片文件进入
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
      photoMagnify(index) {
        this.dialogVisible = true;
        this.PreviewImg = this.imgList[index].file.src;
      },
      fileDel(index) {
        this.size = this.size - this.imgList[index].file.size;
        this.imgList.splice(index, 1);
      },
      bytesToSize(bytes) {
        if (bytes === 0) return '0 B';
        let k = 1024,
          sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
          i = Math.floor(Math.log(bytes) / Math.log(k));
        return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
      },


    },
    directives: {
      focus: {
        update: function (el, {value}) {
          if (value) {
            console.log("+++++++++++")
            el.focus()
          }
        }
      }
    },

  }
</script>
<style lang="scss" scoped>
  /*@import "../../../../../static/base.css";*/
  @import '../../../../../style/index';

  /*.upload_warp_img_div img {*/
    /*width: 80px;*/
  /*}*/

  .clickBtn {
    height: 32px;
    /*border: 1px solid red;*/
    width: 32px;
    position: absolute;
    right: 0;
    top: 0;
    cursor: pointer;
    font-size: 17px;
    text-align: center;
    line-height: 32px;
  }

  .yourselfInput {
    position: relative;
  }

  .yourselfKeyword {
    margin-left: 40px;
    margin-bottom: 20px;
    color: #2a8ce7;
    font-size: 17px;
    cursor: pointer;
  }

  .yourselfKeyword span {
    margin-left: 4px;
    font-size: 12px;
    line-height: 1;
  }

  .yourselfInput {
    width: 200px;
    margin-top: 22px;
    margin-left: 40px;
    color: #2a8ce7;
  }

  .photoPre {
    text-align: center;
  }

  .photoPre img {
    width: 360px;
  }

  .el-message-box {
    height: 330px !important;
  }

  .mt30 {
    margin-top: 30px;
  }

  .addQuestion {
    color: #555;
    font-size: 16px;
    font-family: "Microsoft YaHei";
    background: #F9FAFC;
    height: 34px;
    line-height: 34px;
    padding-left: 10px;
  }

  .addContent {
    /*padding-top: 30px;*/
    /*padding-left: 40px;*/
    margin-left: 40px;
    margin-top: 30px;
    box-sizing: content-box;
    /*padding-right: 40px;*/
    max-width: 997px;
    color: #999;
    font-size: 12px;
  }

  .addContent input {

  }

  .addContent input {
    font-size: 12px;
  }

  .addContentDis {
    padding-bottom: 40px;
    font-size: 14px;
  }

  .questionTit {
    /*text-align: right;*/
    padding-top: 6px;
    color: #999;
    font-size: 12px;
    font-family: "Microsoft YaHei";
    /*padding-right: 30px;*/
    max-width: 997px;
    margin-left: 40px;
    box-sizing: content-box;
  }

  .nextStep {
    text-align: right;
    /*margin-top: 33px;*/
    margin-right: 11px;
    width: 1000px;
    padding-top: 20px;
    box-sizing: content-box;
    margin-bottom: 20px;
  }

  .nextStepp {
    /*text-align: right;*/
    /*margin-top: 33px;*/
    margin-right: 11px;
    max-width: 1000px;
    margin-top: 20px;
  }

  /*.nextStepTop {*/
  /*text-align: right;*/
  /*margin-top: 33px;*/
  /*!*margin-right: 11px;*!*/
  /*max-width: 996px;*/
  /*margin-left: 40px;*/
  /*}*/
  .nextStepTop {
    /*text-align: right;*/
    margin-top: 40px;
    /*margin-right: 11px;*/
    max-width: 996px;
    /*margin-left: 40px;*/
  }
  .nextStepTop button{
width: 80px;
    padding: 0;
    text-align: center;
    line-height:32px;
    height: 32px;
  }

  .nextStep button {
    width: 80px;
    text-align: center;
    height: 32px;
    line-height: 32px;
    padding: 0;
  }

  .nextStepp button {
    width: 80px;
    text-align: center;
    height: 32px;
    line-height: 32px;
    padding: 0;
    border:1px solid #2a8ce7;

  }
  .nextStepp .nextSteppButton {
    width: 80px;
    text-align: center;
    height: 32px;
    line-height: 32px;
    padding: 0;
    border:1px solid #2a8ce7;
    color: #2a8ce7;
  }

  .keywords {

    padding: 0 40px;
    max-width: 1020px;
  }

  .checkboxContent {
    display: inline-block;
    width: 185px;
    /*border: 1px solid red;*/
    padding-top: 30px;
    /*overflow: hidden;*/
    /*text-overflow:ellipsis;*/
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .CreateNewQAtextareaParent {
    position: relative;
    padding-top: 30px;
    padding-bottom: 20px;
    /*width: 1000px;*/
    /*height: 300px;*/
  }

  .upload_warp_left {
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
    /*border: 1px dashed #fff;*/
    border-radius:5px;
    background-color: #fbfdff;
  }

  .upload_warp_left:hover {
    border-color: #409eff;
    color: #409eff;
    cursor: pointer;
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

  /*.upload_warp_img_div img {*/
    /*width: 80px;*/
  /*}*/

  .upload_warp_img {
    display: inline-block;
    vertical-align: middle;

  }

  .upload_warp_img_div_top {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);

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

  .upload_warp_img_div_top:hover {

    background: rgba(0, 0, 0, 0.4);

    cursor: pointer;
  }

  .upload_warp_img_div_top img {
    width: 80px;
    height: 100%;
    -webkit-border-radius: 6px;
    -moz-border-radius: 6px;
    border-radius: 6px;
  }

  .upload_warp_img_div img {
    width: 80px;
    height: 100%;
    -webkit-border-radius: 6px;
    -moz-border-radius: 6px;
    border-radius: 6px;
  }
  .photoUp {
    text-align: left;
  }

  .upload_warp_img_div_text {
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

  .updateTextarea textarea {
    width: 450px;
    height: 300px !important;
    color: #999;
  }

  .CreateNewQAtextareaParentAdd {
    margin-top: 30px;
    /*margin-bottom: 30px;*/
    position: relative;
    max-width: 1000px;
    height: 300px;

  }

  .CreateNewQAtextareaParentAdd .fontCount {
    word-break: keep-all;
    color: #999;
    position: absolute;
    right: 10px;
    bottom: 10px;
  }

  .imgLimit {
    display: inline-block;
    color: #c3c3c3;
    margin-left: 20px;
  }

  .max1000 {
    max-width: 1000px;
    text-align: right;
    margin-top: -10px;
    z-index: 3;
    margin-top: -52px;
    padding-right: 10px;
    color: #999;
  }

  .max1000 span {
    padding-right: 10px;
  }
</style>

<style>
  .CreateNewQAtextareaParentAdd textarea {
    width: 100%;
    height: 100%;
    padding: 8px;
    resize: none;
    outline: none;
    box-sizing: border-box;

  }

  .CreateNewQAtextareaParentAdd textarea:hover {
    border: 1px solid #409eff;
  }

</style>
<style>

  .yourselfInput input {
    border: 1px solid #2a8ce7;
    border-radius: 5px;
  }

  .yourselfInput span {
    color: #2a8ce7;
  }

  .addContent input {
    font-size: 12px;
  }

  .checkboxContent .el-checkbox__label {

    width: 145px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .checkboxContent label > span {
    display: inline-block;
    vertical-align: text-top;
    line-height: 1;
  }
</style>








