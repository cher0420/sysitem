<template>
  <div v-loading="loadingEdit"

      >
    <div class="keywordTip">
      关键词
    </div>
    <div class="kwShow">
      {{Keyword}}
    </div>
    <div class="keywordTip">
      设置答案
    </div>
    <div class="edit_textarea">
      <textarea maxlength="500"
                placeholder="请输入自定义回答,最多500个字符"
                v-model="Text.Answer" class="editTextarea">
      </textarea>
      <span class="fontCount">{{Text.Answer.length}}/500字</span>

    </div>

    <div class="photoUp">
      <input @change="fileChange($event)" type="file" id="upload_file" multiple style="display: none"/>


      <div class="upload_warp_img" v-if="Image.length!=0">

        <div class="upload_warp_img_div " v-for="(item,index) of Image" v-if="item.Answer !=''">
          <div class="upload_warp_img_div_top">
            <div class="upload_warp_img_div_text">
              <!-- 放大图片 -->
              <i class="el-icon-zoom-in" @click="OldPhotoMagnify(index)"></i>
              <i class="el-icon-delete" @click="OldFileDel(index)"></i>
            </div>

          </div>
          <img :src="item.Answer">
        </div>


      </div>
      <!-- show photo -->
      <div class="upload_warp_img" v-show="imgList.length!=0">
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

      <div class="upload_warp_left" @click="fileClick" v-show="imgList.length<3">
        <i class="el-icon-plus"></i>
      </div>

      <div class="imgLimit">
        （至多上传3张，每张不超过200K，支持jpg、jpeg、png、gif格式）
      </div>


    </div>
    <div>
      <div class="subFinsh">
        <el-button type="primary" size="small" @click="getPhotoUrl" v-if="subInfo">完成</el-button>
        <el-button type="primary" size="small" :loading="true" v-if="!subInfo">提交中...</el-button>
      </div>
    </div>
    <!-- 预览 -->
    <el-dialog
      title="图片预览"
      :visible.sync="dialogVisible"
      width="45%"
      :before-close="handleClose">
      <div class="photoYl"><img :src="PreviewImg"></div>
      <span slot="footer" class="dialog-footer">
  </span>
    </el-dialog>


  </div>
</template>
<script>


  // import {mapGetters} from 'vuex';
  // import {mapActions} from 'vuex';
  import {mapGetters,mapActions} from 'vuex';

  import {TOKEN} from "../../../../../constants/constants";
  import {getCookies} from "../../../../../utils/cookie";
  import base from "../../../../../host/baseUrl";
  import store from "../../../../../store/index";
  import {UploadAndDeleteAsync} from "../../../../../api/getdata";  //  异步请求


  export default {
    name: "Allen-EditQA",
    data() {
      return {
        loadingEdit:false,
        subInfo: true,

        addIcon: true, // 图片添加功能 + 是否显示

        dialogVisible: false,
        PreviewImg: "",   // 预览图片src


        imgList: [], // 本地图片格式 date64
        size: 0,
        imgListNew: [],  // 上传图片到服务器的格式 http

        // 根据关键字获取答案
        Question: "",
        Keyword: "",
        KeyId: "",

        Text: {   // 答案
          ID: "",
          Answer: "",
        },
        Image: [{ // 后台返回过来的
          ID: "",
          Answer: "",
        }],
        ImageNew: [],// 要上传的图片列表

        DeleteIds: [], // 删除图片id
        DeleteAnswers: [],

      }
    },
    computed: {},

    created() {
      this.getData();
      this.checkSize();
    },
    mounted() {


    },
    watch: {},
    methods: {
      getData() {
        // let query = this.$route.query;
        let data = JSON.parse(sessionStorage.getItem('edit'));
        console.log("+++++++", data)
        this.Keyword = data.Keyword.replace(/,/g,'、');
        this.Question = data.Question;
        this.getCheckKeywords();
      },
      getCheckKeywords() {  //  	根据关键字 获取详情
        let that = this;
        const token = getCookies(TOKEN);
        let recordId = JSON.parse(sessionStorage.getItem('recordId'));
        console.log("recordId++++", recordId)
        let data = {
          "BotConfigId": recordId,
          "Keys": this.Keyword.replace(/、/g,',')
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

            console.log("根据关键字获取答案", msg)

            if (msg.Status == "1") {
              // 修改答案
              if (msg.Data != null) {
                //       console.log("shuju",msg.Data)
                // code
                that.Question = msg.Data.Question;
                that.Keyword = msg.Data.Keyword.replace(/,/g,'、');
                that.Text = msg.Data.Text;
                that.Image = msg.Data.Image;
                that.KeyId = msg.Data.KeyId;


              }

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
           let thatt = this;
       // this.loadingEdit = true;
        this.$confirm('是否确认修改此文件?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          thatt.loadingEdit = true;
          this.subInfo = false;
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
          //  console.log("change", this.imgListNew)
          let recordId = JSON.parse(sessionStorage.getItem('recordId'));
          data = {
            "Id": recordId,
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
              //     console.log("photo反馈", msg)
              if (msg.Status == "1") {
                let ImageNeww = [];
                if (msg.Data.FilesName.length > 0) {
                  for (var i = 0; i < msg.Data.FilesName.length; i++) {
                    ImageNeww[i] = {
                      ID: "",
                      Answer: msg.Data.FilesName[i]
                    }
                  }
                }
                that.ImageNew = ImageNeww.concat(that.Image)
                that.updataAnswer();
              }
            }
          })


        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消修改'
          });
        });

      },
      updataAnswer() { // 更新问题


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
          "Keyword": that.Keyword.replace(/、/g,','),
          "Text": that.Text,
          "Image": that.ImageNew,
          "DeleteIds": that.DeleteIds,
          "Email": Email,
          "FullName": FullName
        };

        if(that.Text.Answer.trim() == "" && that.ImageNew.length == 0){
          console.log("答案不能为空")
          that.$message({
            message: '答案不能为空',
            type: 'warning'
          });

          that.subInfo = true;
          that.loadingEdit = false;
          return false
        }
        if (this.Text.Answer.indexOf("<") != "-1" ||this.Text.Answer.indexOf(">") != "-1" || this.Text.Answer.indexOf("&") != "-1" || this.Text.Answer.indexOf("$") != "-1" || this.Text.Answer.indexOf("%") != "-1") {

          this.$message({
            message: '<> $ & % 为敏感字符，请勿添加在答案中',
            type: 'warning'
          });
          this.subInfo = true;
          this.loadingEdit = false;
          return false;
        }




        // this.loadingEdit = true;
        $.ajax({
          type: "POST",
          headers: {
            "Content-Type": "application/json;charset=utf-8",
            'Access-Token': token
          },
          url: base.requestHost + "/api/QuickQA/StoreQAData",
          data: JSON.stringify(data),
          success: function (msg) {
            if (msg.Status == "1") {
              that.delPhoto();// 删除数据库中对应的图片
              that.subInfo = true;

              that.$message({
                message: '更新新问答成功',
                type: 'success'
              });
              that.loadingEdit = false;
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
              that.loadingEdit = false;
              that.$message({
                message: '更新新问答失败',
                type: 'success'
              });
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
        console.log("daxiao", file.size / 1024)
        let currSize = file.size / 1024;
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
      fileDel(index) {
        this.size = this.size - this.imgList[index].file.size;//总大小
        this.imgList.splice(index, 1);

      },
      OldFileDel(index) {
        // console.log(this.Image[index]);
        this.DeleteIds.push(this.Image[index].ID); // 删除图片的id
        this.DeleteAnswers.push(this.Image[index].Answer); // 删除图片的地址
        //  console.log( this.DeleteIds)
        this.Image.splice(index, 1);


      },
      photoMagnify(index) {
        this.dialogVisible = true;
        this.PreviewImg = this.imgList[index].file.src;
        // console.log("item", this.imgList[index].file.src)
      },
      OldPhotoMagnify(index) {
        this.dialogVisible = true;
        this.PreviewImg = this.Image[index].Answer;
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
          // console.log(111111111)
          // if (that.Text.Answer.length > 500) {  // 检查字数
          //   that.Text.Answer = that.Text.Answer.toString().substr(0, 500);
          // }
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

  .photoYl {

    text-align: center;

  }

  .photoYl img {
    width: 360px;
  }

  .max1000 {
    max-width: 1000px;
    text-align: right;
    margin-left: 40px;
    margin-top: -30px;
    z-index: 3;
    word-break: keep-all;
  }

  .max1000 span {
    margin-right: 10px;
    color: #999;
  }

  .keywordTip {
    height: 36px;
    line-height: 36px;
    font-size: 16px;
    background: #F9FAFC;
    padding-left: 10px;
    color: #555;

  }

  .questionTitl {
    color: #555;
    font-size: 24px;
    margin-top: -85px;
    margin-left: 10px;
    margin-bottom: 30px;
  }

  .subFinsh {
    /*position: absolute;*/
    /*right: 0;*/
    /*top: 30px;*/
    padding-top: 20px;
  }

  .imgLimit {
    display: inline-block;
    color: #c3c3c3;
  }

  .kwShow {
    padding-bottom: 40px;
    padding-top: 30px;
    padding-left: 40px;
    font-size: 14px;
    color: #555;
  }

  .edit_textarea {
    margin-top: 30px;
    padding-left: 40px;
    max-width: 1000px;
    position: relative;
  }

  .edit_textarea .fontCount {
    word-break: keep-all;
    color: #999;
    position: absolute;
    right: 10px;
    bottom: 10px;
  }

  .upload_warp_img {
    display: inline-block;
    vertical-align: middle;
    position: relative;
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

  .upload_warp_img_div_top i {
    font-size: 20px;

  }

  .upload_warp_img_div_top:hover {
    background: rgba(0, 0, 0, 0.4);
    cursor: pointer;
    color: #fff;
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
    border-radius:6px;
    margin-right: 20px;
    background-color: #fbfdff;
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
    //-webkit-box-shadow: 0 0 10px #c0c4cc;
    //  -moz-box-shadow: 0 0 10px #c0c4cc;
    /*box-shadow: 0 0 10px #c0c4cc;*/
  }

  .upload_warp_img_div img {
    width: 80px;
    height: 100%;
    -webkit-border-radius: 6px;
    -moz-border-radius: 6px;
    border-radius: 6px;
  }

  .photoUp {
    margin-top: 20px;
    margin-left: 40px;
    position: relative;
    max-width: 1000px;
    margin-bottom: 20px;
  }

  .upload_warp_img_div_text {
    /*text-align: right;*/
    padding-right: 2px;
    padding-top: 2px;
    padding-left: 18px;
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
    border: 1px solid #999;
    width: 100%;
    height: 300px;
    resize: none;
    outline: none;
    padding: 5px;
    box-sizing: border-box;
    font-size: 14px;
  }

  .edit_textarea textarea:hover {
    border: 1px solid #409eff;
  }
</style>


