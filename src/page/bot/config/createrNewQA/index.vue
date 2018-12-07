<template>
  <div class="yoy-main cc">
    <div v-if="newDataDis">
      <div class="addQuestion">
        第一步 ： 添加问题
      </div>
      <div v-if="questionDis">
        <div class="addContent">
          <el-input v-model="Question" placeholder="例如:2018年年会举办地点"></el-input>
        </div>
        <div class="questionTit">
          请用最简洁的方式描述你的问题
        </div>
        <div class="nextStepTop">
          <el-button type="primary" size="mini" @click="getKeywords" v-if="!loading">下一步</el-button>
          <el-button type="primary" size="mini" v-if="loading" :disabled="loading" :loading="loading">下一步</el-button>
        </div>
      </div>
      <div class="addContent addContentDis" v-if="!questionDis">
        {{Question}}
      </div>
      <div v-if="!questionDis">
        <div class="addQuestion">
          第二步 ： 确认关键词 ( 可选择2-4个 )
        </div>
        <div v-if="keywordsDis">
          <div class="keywords">
            <el-checkbox-group v-model="keywords" :min="0"
                               :max="4">
              <div class="checkboxContent" v-for="item in keywordsOption" :key="item">
                <el-checkbox :label="item" name="keywords"></el-checkbox>
              </div>
            </el-checkbox-group>
            <!--{{keywords}}-->
          </div>
          <div class="nextStep mt30">
            <el-button type="primary" plain size="mini" @click="questionLast">上一步</el-button>
            <el-button type="primary" size="mini" @click="getCheckKeywords()" :disabled="checkboxDisabled">
              下一步
            </el-button>
          </div>
        </div>
        <div class="addContent addContentDis" v-else>
          关键词: {{keywordsNew}}
        </div>
        <div v-if="!keywordsDis">
          <div class="addQuestion">
            第三步: 设置答案
          </div>
          <div class="CreateNewQAtextareaParentAdd">
            <div>
              <el-input
                type="textarea"
                placeholder="请输入自定义回答,最多500个字符"
                v-model="textarea" class="CreateNewQAtextarea">
              </el-input>

            </div>

          </div>
          <div class="max1000">
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
                      <i class="el-icon-zoom-in" @click="fileDel(index)"></i>
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
                ( 支持.jpg,.jpeg,.png,.gif,svg格式, 最大不超过200k , 最多3张 )
              </div>
            </div>

            <el-button type="primary" plain size="mini" @click="keywordsLast">上一步</el-button>
            <el-button type="primary" size="mini" @click="getPhotoUrl">完成</el-button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!newDataDis">
      <updateQA></updateQA>
    </div>
  </div>
</template>
<script>

  import updateQA from "./updateQA";
  import {mapGetters} from 'vuex';
  import {mapActions} from 'vuex';

  import {TOKEN} from "../../../../constants/constants";
  import {getCookies} from "../../../../utils/cookie";
  import base from "../../../../host/baseUrl";
  import store from "../../../../store/index"


  export default {
    name: "Allen-CreateNewQA",
    data() {
      return {
        addIcon:true,
        loading: false,
        // Question: "公积金如何办理", // 题目
        Question: "", // 题目
        keywordsOption: [], // 关键词
        keywords: [], // 选中的关键字
        textarea: "",
        timer: "",
        checkboxDisabled: true,
        // newDataDis: true, // 展示新建答案
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
      ]),
      keywordsNew() {
        return this.keywords.join(","); //  关键词拼接展示
      },


    },
    components: {
      updateQA
    },

    created() {

      this.checkSize()


    },
    mounted() {


    },
    watch: {
      keywords(curVal, oldVal) {
        if (1 < curVal.length && curVal.length < 5) {
          this.checkboxDisabled = false;
          return false;
        }
        this.checkboxDisabled = true;

      },
      imgList(curVal, oldVal){
        if( 2 < curVal.length){
          this.addIcon = false;
        }else{
          this.addIcon = true;
        }
      },
    },

    methods: {
      ...mapActions(
        ["questionNext", "questionLast", "keywordsNext", "keywordsLast", "newDataHid"]
      ),

      getKeywords() {  // 将一句话分成多个词汇
        if (this.Question == "") {
          this.$alert('请添加问题', '友情提示', {
            confirmButtonText: '确定',
            callback: action => {
              //
            }
          });
          return false;
        }
        // 加载中
        this.loading = true;


        var that = this;

        const token = getCookies(TOKEN);

        let data = {
          "Question": this.Question
        }
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
            // console.log("msg",msg)
            if (msg.Status == "1") {
              that.keywordsOption = msg.Data;
              that.questionNext();
              console.log("msg", msg)

            }

          }
        })


      },
      getCheckKeywords() {  // 	根据关键字获取答案
        let that = this;
        const token = getCookies(TOKEN);
        let recordId = JSON.parse(sessionStorage.getItem('recordId'));
        // console.log("recordId",recordId)
        let data = {
          "BotConfigId": recordId,
          "Keys": this.keywordsNew
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

            // console.log("根据关键字获取答案", msg)
            if (msg.Status == "1") {
              // 修改答案

              if (msg.Data == null) {
                that.keywordsNext(that.keywords.length);
              }
              if (msg.Data != null) {
                that.newDataHid();
                console.log("+++++++++++++++")
                that.questionLast();
                //   跳到 更新组件展示
                sessionStorage.setItem('Data', JSON.stringify(msg.Data));  //  属性传参到子组件


              }

            }

          }
        })


      },
      saveKeywords() {  // 	存储答案

        console.log("存储答案userInerInfo", store.state.app.userInfo)
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
          "Question": that.Question,
          "Keyword": this.keywordsNew,
          "Text": {
            "ID": "",
            "Answer": this.textarea,
          },
          "Image": that.Image,
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
            console.log("存储答案", msg)
            if (msg.Status == "1") {

              that.$message({
                message: '创建新问答成功',
                type: 'success'
              });
              that.keywordsLast();
              that.questionLast();


              // 跳转到列表页
              const query = that.$route.query;

              console.log("que", query)


              that.$router.push({
                path: '/bot/config/quicklyQA',
                query: {
                  ...query,
                }


              })

            }

          }
        })


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
      getPhotoUrl() { // 上传图片到服务器并拿回地址
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
        this.imgListNew = Files;
        console.log("change", this.imgListNew)

        data = {
          "Id": "",
          "Command": "delete",
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
            console.log("photo反馈", msg)
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

              console.log("img", that.Image)

            }


          }
        })


      },
      fileList(fileList) {
        let files = fileList.files;
        for (let i = 0; i < files.length; i++) {
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
          if (that.textarea.length > 500) {
            that.textarea = that.textarea.toString().substr(0, 500);
          }
        }, 200)
      },
      // updateQA() {
      //   this.$router.push({
      //     path: '/bot/config/updateQA',
      //     params: {
      //       id: "uprateQA"
      //     },
      //   })
      //
      // },

    },
    destroyed() {
      clearInterval(this.timer);

    }

  }
</script>
<style lang="scss" scoped>
  /*@import "../../../../../static/base.css";*/
  @import '../../../../style/index';

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
    padding-top: 30px;
    padding-left: 40px;
    /*padding-right: 40px;*/
    max-width: 997px;
    color: #999;
    font-size: 12px;
  }

  .addContent input {
    font-size: 12px;
  }

  .addContentDis {
    padding-bottom: 40px;
    font-size: 14px;
  }

  .questionTit {
    text-align: right;
    padding-top: 6px;
    color: #999;
    font-size: 12px;
    font-family: "Microsoft YaHei";
    /*padding-right: 30px;*/
    max-width: 997px;
    margin-left: 40px;
  }

  .nextStep {
    text-align: right;
    /*margin-top: 33px;*/
    margin-right: 11px;
    width: 1000px;
    margin-top: 52px;
  }

  .nextStepTop {
    text-align: right;
    margin-top: 33px;
    margin-right: 11px;
    width: 996px;
    margin-left: 40px;
  }

  .nextStep button {
    width: 80px;
    text-align: center;
    height: 32px;
    line-height: 32px;
    padding: 0;
  }

  .keywords {
    padding: 0 40px;
    width: 1200px;
  }

  .checkboxContent {
    display: inline-block;
    width: 185px;
    /*border: 1px solid red;*/
    padding-top: 30px;
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

  .upload_warp_img {
    display: inline-block;
    vertical-align: middle;

  }

  .upload_warp_img_div_top {
    position: absolute;
    left: 0;
    top: 0;

    width: 100%;
    height: 100%;
  }

  .upload_warp_img_div_top:hover {

    background: rgba(0, 0, 0, 0.4);

    cursor: pointer;
  }

  .upload_warp_img_div_top img {
    width: 10px;
    height: 10px;
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
    margin-bottom: 30px;
    /*position: relative;*/
  }

  .CreateNewQAtextareaParentAdd .fontCount {
    /*position: absolute;*/
    /*right: 33px;*/
    /*bottom: 10px;*/
    word-break: keep-all;
    display: inline-block;
    color: #999;
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
  }

  .max1000 span {
    padding-right: 10px;
  }
</style>

<style>
  .CreateNewQAtextareaParentAdd textarea {
    max-width: 1000px;
    height: 300px;

  }

</style>
<style>
  .addContent input {
    font-size: 12px;
  }
</style>
