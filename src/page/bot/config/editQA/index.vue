<template>
  <div class="yoy-main">

    <div class="keywordTip">
      关键词
    </div>
    <div class="kwShow">
      {{"2018年,年会,地点"}}
    </div>
    <div class="keywordTip">
      设置答案
    </div>
    <div class="edit_textarea">
      <el-input
        type="textarea"
        placeholder="请输入自定义回答,最多500个字符"
        v-model="Text.Answer" class="editTextarea">
      </el-input>
      <span class="fontCount">{{Text.Answer.length}}/500字</span>
    </div>
    <div class="photoUp">
      <input @change="fileChange($event)" type="file" id="upload_file" multiple style="display: none"/>
      <!-- show photo -->
      <div class="upload_warp_img" v-show="imgList.length!=0">
        <div class="upload_warp_img_div cc222" v-for="(item,index) of imgList">
          <div class="upload_warp_img_div_top">
            <div class="upload_warp_img_div_text">
              <span></span>
              <i class="el-icon-close" @click="fileDel(index)"></i>
            </div>

          </div>
          <img :src="item.file.src">
        </div>
      </div>

      <div class="upload_warp_left" @click="fileClick">
        <i class="el-icon-plus"></i>
      </div>

      <div class="imgLimit">
        ( 支持.jpg,.jpeg,.png,.gif,svg格式, 最大不超过200k , 最多3张 )
      </div>
      <div class="subFinsh">
        <el-button type="primary" size="mini" @click="getPhotoUrl">完成</el-button>
      </div>

    </div>


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
        // 图片上传
        imgList: [],
        size: 0,
        imgListNew: [],
        Image: [],

        "Text": {
          "ID": "",
          "Answer": "上海市徐汇区天华信息科技园",
        },
      }
    },
    computed: {},

    created() {


    },
    mounted() {


    },
    watch: {},

    methods: {


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


    },
    destroyed() {
      clearInterval(this.timer);

    }

  }
</script>
<style lang="scss" scoped>
  @import '../../../../style/index';
  /*@import "../../../../../static/base.css";*/

  .keywordTip {
    height: 36px;
    line-height: 36px;
    font-size: 18px;
    background: #F9FAFC;
    padding-left: 10px;

  }
  .subFinsh {
    position: absolute;
    right: 0;
    top: 30px;
  }
  .imgLimit{
    position: absolute;
    left: 340px;
    top: 33px;
    color: #c3c3c3;
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
    position: relative;
  }

  .edit_textarea .fontCount {
    position: absolute;
    left: 980px;
    bottom: 10px;
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
    background: rgba(226, 226, 226, 0.4);
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

  .upload_warp_img_div {
    width: 80px;
    height: 80px;
    /*border: 1px solid red;*/
    margin-right: 20px;
    -webkit-box-shadow: 0 0 10px #c0c4cc;
    -moz-box-shadow: 0 0 10px #c0c4cc;
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
    width: 1000px;
  }
  .upload_warp_img_div_text {
    text-align: right;
    padding-right: 2px;
    padding-top: 2px;
  }
  .upload_warp_img_div  {
    position: relative;
    display: inline-block;
  }
  .imgLimit {

  }
</style>
<style>

  .edit_textarea textarea {
    width: 1000px;
    height: 300px !important;
    position: relative;
  }
</style>


