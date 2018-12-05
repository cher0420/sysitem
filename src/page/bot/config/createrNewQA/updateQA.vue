<template>
  <div class="yoy-main mainStyle clearfix">
    <div class="oldQA">
      <div class="existingQuestion">
        <div class="existingQues">
          已有问题
        </div>
        <div class="createTime">
          创建时间 : {{"2018.01.01"}}
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
        <el-input
          type="textarea"
          placeholder="请输入自定义回答,最多500个字符"
          v-model="Answer" class="CreateNewQAtextarea">
        </el-input>
        <span class="fontCount">{{Answer.length}}/500字</span>
      </div>
    </div>
    <div class="newQA">
      <div class="existingQuestion">
        <div class="existingQues">
          第一步: 添加问题
        </div>

      </div>
      <div class="questionDetail">
        问题 : {{Question}}
      </div>
      <div class="existingQuestion">
        <div class="existingQues">
         第二步 : 确认关键词 ( 可选择2-4个 )
        </div>
      </div>
      <div class="questionDetail">
        关键词 : {{Keyword}}
      </div>
      <div class="existingQuestion">
        <div class="existingQues">
          第三步 : 设置答案
        </div>
      </div>
      <div class="updateTextareaa updataQuestions">
        <el-input
          type="textarea"
          placeholder="请输入自定义回答,最多500个字符"
          v-model="AnswerEdit" class="CreateNewQAtextarea">
        </el-input>
        <span class="fontCount">{{AnswerEdit.length}}/500字</span>
      </div>
      <div class="nextStep clearfix">
        <div class="photoUp">
          <input @change="fileChange($event)" type="file" id="upload_file" multiple style="display: none"/>
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

        </div>

      </div>
      <div>
        ( 支持.jpg,.jpeg,.png,.gif,svg格式,最大不超过200k , 虽多三张  )
      </div>
      <div class="alterKey">
        <el-button type="primary" plain size="mini" @click="alterKeyWords()">修改关键词</el-button>
        <el-button type="primary" size="mini"  @click="getPhotoUrl()" >更新回答</el-button>
      </div>
    </div>
  </div>
</template>
<script>

  import {TOKEN} from "../../../../constants/constants";
  import {getCookies} from "../../../../utils/cookie";
  import base from "../../../../host/baseUrl";
  import store from "../../../../store/index"

  export default {
    name: "Allen-updateQA",
    data() {
      return {
        AnswerEdit:"",
        Question:"",
        Keyword:"",
        Answer:"",

        // 图片上传
        imgList: [],
        size: 0,
        imgListNew: [],
        Image: []

      }
    },
    computed: {},
    components: {},

    created() {
      this.getData();


    },

    methods: {
      getData(){
        let data = JSON.parse(sessionStorage.getItem('Data'));
        this.Question = data.Question;
        this.Keyword = data.Keyword;
        this.Answer = data.Text.Answer;
        this.AnswerEdit = data.Text.Answer
        console.log("属性穿的值",data);
      },
      updataAnswer(){ // 更新问题


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
            "Answer ": this.textarea,
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
                message: '更新新问答成功',
                type: 'success'
              });

            }

          }
        })

      },

      alterKeyWords(){
        this.$router.push({
          path: '/bot/config/index',
          params: {
            "alterKeyWords": "alterKeyWords"
          },
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
                obj.Answer = "",
                  obj.ID = "";
                that.Image.push(obj);
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


    },


  }
</script>
<style lang="scss" scoped>
  @import '../../../../style/index';

  .mainStyle {
    font-size: 12px;
    color: #999;
    font-family: "Microsoft YaHei";

  }

  .oldQA {
    float: left;
    width: 50%;
    border-right: 1px solid rgba(227, 227, 227, 0.7);
    padding-right: 50px;
  }

  .newQA {
    float: left;
    width: 50%;
    /*border: 1px solid green;*/
    padding-left: 50px;
  }

  .existingQuestion {
    position: relative;
  }

  .createTime {
    position: absolute;
    right: 0;
    top: 2px;

  }

  .existingQues {
    color: #555;
    font-size: 16px;
  }

  .questionDetail {
    font-size: 14px;
    color: #555;
    padding-left: 32px;
    padding-top: 30px;
    padding-bottom: 40px;

  }


  .fontCount {
    position: absolute;
    right:-20px;
    bottom: 40px;
    color: #999;
  }
  .updataQuestions {
    padding-left: 0;
  }
  .updataQuestions .fontCount{
    right: 10px;
  }
  .nextStep {
    padding-bottom: 30px;
    text-align: right;
  }
  .nextStep button {
    width: 100px;
    text-align: center;
    height: 32px;
    line-height: 32px;
    padding: 0;
  }
</style>

<style>
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

  .upload_warp_img {
    display: inline-block;

  }

  .upload_warp_img_div_top {
    position: absolute;
    left: 0;
    top: 0;
    background: rgba(226, 226, 226, 0.4);
    width: 100%;
  }

  .upload_warp_img_div_top img {
    width: 10px;
    height: 10px;
  }

  .photoUp {
    text-align: left;
  }

  .upload_warp_img_div_text span {

    display: inline-block;
    height: 16px;
    line-height: 16px;
  }

  .upload_warp_img_div_text i {
    cursor: pointer;
    position: absolute;
    right: 5px;
    top: 3px;

  }
.alterKey {
  text-align: right;
}
</style>
