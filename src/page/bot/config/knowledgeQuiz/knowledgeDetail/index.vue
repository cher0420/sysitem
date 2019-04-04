<template>
  <section class="c999 f-s-14">
    <section class="tapList">
      <span class="firTap">选择渠道：</span>
      <span  v-for="(data,key) in tapList"  :key='key' class="text-a-c"  v-bind:class="{isChecked:key === botCheckIndex}"  @click="handleClick(key)" :index="key" >
        <i
          :style="{background: key === botCheckIndex?
        'url(' + require(`../../../../../assets/bot/${key}Checked.png`) + ')center center no-repeat':
          'url(' + require(`../../../../../assets/bot/${key}.png`) + ')center center no-repeat'
        }"
          alt
          class="align-middle"
        ></i>
        {{data}}
      </span>
    </section>
    <el-row v-loading="loading">
      <el-tabs v-model="defaultState" type="card" @tab-click="handleTip" class="yoy-tabs">
        <el-tab-pane label="标准回答" name="second" class="yoy-tab-pane">
          <textarea
            class="c555 friend-answer"
            rows="8"
            cols="10"
            placeholder="请输入自定义友好回答"
            v-model="basicAnswer"
            @input="getTextTotals"
          ></textarea>
          <!-- <span style="display: inline-block;
            width: 100%;
            text-align: right;
            position: absolute;
            height: 14px;
            line-height: 14px;
            right: 20px;
          bottom: 20px;">{{textTotal}}/500字</span>-->
        </el-tab-pane>
        <el-tab-pane label="友好回答" name="first" class="yoy-tab-pane">
          <textarea
            class="c555 friend-answer"
            rows="8"
            cols="10"
            placeholder="请输入自定义友好回答"
            v-model="friendlyAnswer"
            @input="getTextTotal"
          ></textarea>
          <!-- <span style="display: inline-block;
            width: 100%;
            text-align: right;
            position: absolute;
            height: 14px;
            line-height: 14px;
            right: 20px;
          bottom: 20px;">{{textTotal}}</span>-->
        </el-tab-pane>
      </el-tabs>
      <section class="uploadContainer" v-if="defaultState === 'first'">
        <section
          style="text-align: left;height: 12px;line-height: 12px;margin-top: 6px;margin-bottom: 22px;"
          class="f-s-12"
        >提示：设置友好回答则会优先显示友好回答内容</section>
        <el-row
          v-show="uploadList.length>0"
          class="el-upload-list el-upload-list--picture-card"
          style="float: left;"
        >
          <el-col v-for="(item,index) in uploadList" :key="index" class="p-relative picItem text-a-c" >
            <img :src="item.KnowledgeBase" alt="图片" class="align-middle-img">
            <!--<img src="item.KnowledgeBase" alt="图片" class="align-middle-img"/>-->
            <section class="p-absolute opacity f-s-20" >
              <span class="dis-i-b"  >
                <i class="el-icon-zoom-in" @click="preview(item.KnowledgeBase)"></i>
                <i class="el-icon-delete"  @click="handleDel(item,index,'uploadList')"></i>
              </span>
            </section>
          </el-col>
        </el-row>
        <section style="height: 80px;">
          <section
            v-if="uploadList.length<3"
            class="el-upload el-upload--picture-card p-relative"
            @click="uploadContainer"
            style="float: left;margin-right: 20px"
          >
            <i
              class="el-icon-plus"
              style="position: absolute;left: 50%;
          top: 50%;
          margin-top: -14px;
          margin-left: -14px;"
            ></i>
            <input
              type="file"
              accept="image/*"
              class="el-upload__input"
              style="display: none"
              ref="yoy-image-upload"
              @change="uploadHandle"
            >
          </section>
          <section class="tips">（至多上传3张，每张不超过200K，支持jpg、jpeg、png、gif格式）</section>
        </section>
        <section class="full-width buttonContainer">
          <el-button type="primary" @click="save"  :disabled='uploadList.length ===0&&!friendlyAnswer'>保存</el-button>
          <el-button type="danger" @click="deleteDetail" :disabled="disabled">删除</el-button>
        </section>
        <el-dialog :visible.sync="dialogVisible" class="text-a-c">
          <img width="400" :src="dialogImageUrl" alt>
        </el-dialog>
      </section>
      <section class="uploadContainer" v-else>
        <section
          style="text-align: right;height: 12px;line-height: 12px;margin-top: 6px;margin-bottom: 2px;padding-top:20px;"
          class="f-s-12"
        ></section>
        <!-- biao -->
        <el-row
          v-show="uploadList2.length>0"
          class="el-upload-list el-upload-list--picture-card"
          style="float: left;"
        >
          <el-col v-for="(item,index) in uploadList2" class="p-relative picItem text-a-c" :key="index">
            <img :src="item.KnowledgeBase" alt="图片" class="align-middle-img">
            <!--<img src="item.KnowledgeBase" alt="图片" class="align-middle-img"/>-->
            <section class="p-absolute opacity f-s-20">
              <span class="dis-i-b">
                <i class="el-icon-zoom-in" @click="preview(item.KnowledgeBase)"></i>
                <i class="el-icon-delete" @click="handleDel(item,index,'uploadList2')"></i>
              </span>
            </section>
          </el-col>
        </el-row>
        <section style="height: 80px;">
          <!-- <section
            style="text-align: left;height: 12px;line-height: 12px;margin-top: -14px;margin-bottom:22px;display:block;display:none;"
            class="f-s-12"
          >提示：设置友好回答则会优先显示友好回答内容</section> -->
          <section
            v-if="uploadList2.length<3"
            class="el-upload el-upload--picture-card p-relative"
            @click="uploadContainer"
            style="float: left;margin-right: 20px;display:block">
            <i
              class="el-icon-plus"
              style="position: absolute;
                      left: 50%;
                      top: 50%;
                      margin-top: -14px;
                      margin-left: -14px;"
            ></i>
            <input
              type="file"
              accept="image/*"
              class="el-upload__input"
              style="display: none"
              ref="yoy-image-upload"
              @change="uploadHandle"
            >
          </section>
          <section class="tips">（至多上传3张，每张不超过200K，支持jpg、jpeg、png、gif格式）</section>
        </section>
        <section class="full-width buttonContainer" >
          <el-button type="primary" @click="save" :disabled='uploadList2.length ===0&&!basicAnswer'>保存</el-button>
          <el-button type="danger" @click="deleteDetail" class='deleteBtn'>删除</el-button>

        </section>
        <el-dialog :visible.sync="dialogVisible" class="text-a-c">
          <img width="400" :src="dialogImageUrl" alt>
        </el-dialog>
      </section>

    </el-row>
  </section>
</template>
<script>
  import { handleDetail } from "./service";
  import URL from "../../../../../host/baseUrl";
  import {
    BOTKNOWDETAIL,
    UPDATEKNOWDETAIL,
    DELETEKMOWDETAIL
  } from "../../../../../constants/api";
  import { upload_delete_img } from "../../../../../serive/request";
  import { TENANTID, USERNAME } from "../../../../../constants/constants";
  import { getCookies } from "../../../../../utils/cookie";

  export default {
    data() {
      return {
        // svgName:'https://hightalksqsw2staging.blob.core.windows.net/picturecontainer/754c9f57-17d8-4465-81e0-ab90e08-test/636789999175646986.svg',
        detail: {},
        BasicText: "",
        defaultState: "second", //second:标准答案 first :友好答案
        botCheckIndex: "WeChat",
        tapList: {
          Wechat: "微信端",
          WebChat: "网页端",
          DeskTopChat: "桌面",
          Robot: "实体机器人"
        },
        dialogImageUrl: "",
        dialogVisible: false,
        uploadList: [],
        uploadList2: [],
        friendlyAnswer: "",
        basicAnswer: "",
        editableStatus: true,
        loading: false,
        DeleteIds: [],
        deleteImgArr: [],
        textTotal: 0,
        statusTest: "basic"
      };
    },
    created() {
      const query = this.$route.query;
      const botCheckIndex = query.botCheckIndex; // 选中项
      this.botCheckIndex = botCheckIndex;
      this.get_knowledge_detail(botCheckIndex);

    },
    methods: {
      getBase64(imgUrl) {
        window.URL = window.URL || window.webkitURL;
        var xhr = new XMLHttpRequest();
        xhr.open("get", imgUrl, true);
        // 至关重要
        xhr.responseType = "blob";
        xhr.onload = function() {
          if (this.status == 200) {
            //得到一个blob对象
            var blob = this.response;
            // console.log("blob", blob);
            // 至关重要
            let oFileReader = new FileReader();
            oFileReader.onloadend = function(e) {
              let base64 = e.target.result;

            };
            oFileReader.readAsDataURL(blob);
            //====为了在页面显示图片，可以删除====
            var img = document.createElement("img");
            img.onload = function(e) {
              window.URL.revokeObjectURL(img.src); // 清除释放
            };
            let src = window.URL.createObjectURL(blob);
            img.src = src;
            document.getElementById("container1").appendChild(img);
            //====为了在页面显示图片，可以删除====
          }
        };
        xhr.send();
      },
      deleteDetail() {
        const that = this;

        this.$confirm("是否删除友好答案的全部内容?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            // that.handleDel(v);
            that.deleteAnswer();

          })
          .catch(() => {
            that.loading = false;
            that.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      },
      deleteAnswer() {
        const that = this;
        const list = that.uploadList; //图片

        console.log(that.detail.Friendly)
        const textId = that.detail.Friendly.Text.length >0 ? that.detail.Friendly.Text[0].ID : ''
        const imageId =that.detail.Friendly.Image.length >0 ? that.detail.Friendly.Image[0].ID: ''

        list.length > 0 &&
        list.forEach((v, index) => {
          if (v.ID) {
            that.deleteImgArr.push(v.KnowledgeBase);
            that.DeleteIds.push(v.ID);

          }
        });

        that.DeleteIds = [textId,imageId, ...that.DeleteIds].filter (d => d)
        const id = JSON.parse(sessionStorage.getItem('recordId'))
        const BotConfigRecordId = id?id:this.$route.query.recordId
        const body = {
          BotConfigRecordId,
          Data: {
            DeleteIds: that.DeleteIds
          }

        };
        const params = {
          body: JSON.stringify(body)
        };

        handleDetail(URL.requestHost + DELETEKMOWDETAIL, params).then(res => {
          this.DeleteIds = [];
          this.deleteImgArr = [];
          this.get_knowledge_detail(this.botCheckIndex);
          that.$message({
            type: "success",
            message: "删除成功"
          });
        });

      },
      getTextTotal() {

        this.textTotal =
          this.textTotal === 0 ? this.friendlyAnswer.length : this.basicAnswer.length;

      },
      getTextTotals() {

        this.textTotal =
          this.textTotal === 0
            ? this.friendlyAnswer.length
            : this.basicAnswer.length;
      },
      get_knowledge_detail(channel) {
        const id = JSON.parse(sessionStorage.getItem('recordId'))
        const recordId = id?id:this.$route.query.recordId
        this.loading = true;
        const query = this.$route.query;
        const body = {
          BotConfigRecordId: recordId,
          Data: {
            IntentName: query.IntentName, // 意图
            Channels: channel //渠道
          }

        };

        const params = {
          body: JSON.stringify(body)
        };

        handleDetail(URL.requestHost + BOTKNOWDETAIL, params, "Data").then(
          res => {
            this.detail = res;
            const BasicText =  res.Basic.Text.length !== 0 ? res.Basic.Text[0].KnowledgeBase : "";
            this.basicAnswer = BasicText.replace(/[<br/>]+/g, "\n");
            this.friendlyAnswer =  res.Friendly.Text.length !== 0 ? res.Friendly.Text[0].KnowledgeBase : "";
            //  const images = res.Basic.Image;//初始，切换
            this.uploadList=res.Friendly.Image.slice(0);
            this.uploadList2 =  res.Basic.Image.slice(0);

            this.loading = false;
            this.textTotal = this.friendlyAnswer.length
            this.deletebtn()
          }
        );
      },
      handleClick(v) {
        this.botCheckIndex = v;
        this.get_knowledge_detail(v);

      },
      preview(v) {
        this.dialogVisible = true;
        this.dialogImageUrl = v;
      },
      confirm(v, index,arr) {
        const that = this;
        that
          .$confirm("确认要删除此图片?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
          .then(() => {
            that.del(v, index,arr);
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      },
      handleDel(v, index,arr) {
        this.confirm(v, index,arr);

      },
      del(v, index,arr) {
        this[arr].splice(index, 1);
        if (v.ID) {
          this.DeleteIds.push(v.ID);
          this.deleteImgArr.push(v.KnowledgeBase);
        }

        // this.save();
      },
      uploadHandle(v) {

        const that = this;
        const file = v.target.files[0];
        const type = file.type;
        if (!/image\/\w+/.test(type) || file.type.indexOf("svg") > -1) {
          this.$message({
            type: "error",
            message: "只能上传jpg, jpeg, png, gif格式类型的图片"
          });
          return;
        }
        if (!file || file.size > 200 * 1024) {
          this.$message({
            type: "error",
            message: "请上传文件不大于200KB的图片！"
          });
          return;
        }
        // 读取文件:
        const reader = new FileReader();
        //初始化图像对象
        let obj = {};
        //获取文件名字
        const name = file.name;
        reader.onload = function(e) {
          const KnowledgeBase = e.target.result;

          //图像对象赋值
          // debugger;
          const type = name.substring(name.lastIndexOf(".")).replace(".", "");
          obj = {
            name,
            KnowledgeBase,
            type
          };
          that.defaultState === 'first'? that.uploadList.push(obj): that.uploadList2.push(obj);//需要根据类型增加不同的图片

          that.$refs["yoy-image-upload"].value = "";
        };
        // 以DataURL的形式读取文件:
        reader.readAsDataURL(file);
        // });

      },
      uploadContainer(v) {
        const input = this.$refs["yoy-image-upload"];
        input.click();
        // 监听change事件:
      },

      save() {

        this.loading = true;
        const that = this;
        this.upload_img();
        // this.$confirm("确定保存以上信息?", "提示", {
        //   confirmButtonText: "确定",
        //   cancelButtonText: "取消",
        //   type: "warning"
        // })
        //   .then(() => {

        //    console.log(2)
        // })
        // .catch(() => {
        //   that.loading = false;
        //   this.$message({
        //     type: "info",
        //     message: "取消保存"
        //   });
        // });
      },

      upload_img() {
        const id = JSON.parse(sessionStorage.getItem('recordId'))
        const Id = id?id:this.$route.query.recordId
        const Files = [];
        let imageArr = this.defaultState ==='first'?this.uploadList.slice(0):this.uploadList2.slice(0)//需要根据不同的类型增加图片
        // console.log(1)
        imageArr.forEach((v, key, arr) => {
          if (v.KnowledgeBase.match(/base64,(\S*)/)) {
            const Context = v.KnowledgeBase.match(/base64,(\S*)/)[1];
            const obj = {
              Content:Context,
              Extension: v.type
            };
            Files.push(obj);
          }
        });

        const body = {
          Command: "upload",
          Id,
          Files
        };
        const params = {
          body: JSON.stringify(body)
        };
        upload_delete_img(params).then(res => {
          const arr = [];
          res.FilesName.forEach((v, k) => {
            const obj = {
              KnowledgeBase: v,
              Id: ""
            };
            arr.push(obj);
          });
          this.update_Detail(arr);
        });
      },

      update_Detail(arr) {
        if (
          arr.length === 0 &&
          this.friendlyAnswer === 0 &&
          this.basicAnswer === ""
        ) {
          this.$message({
            type: "error",
            message: "请添加友好答案！"
          });
          this.loading = false;
          return;
        }

        const CreateUserId = getCookies(TENANTID);
        const CreateUserName = getCookies(USERNAME);
        const id = JSON.parse(sessionStorage.getItem('recordId'))
        const BotConfigRecordId = id?id:this.$route.query.recordId
        const IntentID = this.$route.query.IntentID;
        const Channels = this.botCheckIndex;
        const KnowledgeBase =
          this.statusTest === "basic" ? this.basicAnswer : this.friendlyAnswer;
        const KnowledgeBaseType = this.statusTest;
        const text =
          this.statusTest === "basic"
            ? this.detail.Basic.Text[0]
            : this.detail.Friendly.Text[0]; //需要
        const DeleteIds = this.DeleteIds;

        const options = {
          BotConfigRecordId,
          Data: {
            IntentID,
            DeleteIds,
            KnowledgeBaseMode:KnowledgeBaseType,
            Channels,
            Text: {
              ...text,
              KnowledgeBase
            },
            Image: arr,

            Video: [],
            Media: [],
            CreateUserId,
            CreateUserName
          }
        };

        const params = {
          body: JSON.stringify(options)
        };
        handleDetail(URL.requestHost + UPDATEKNOWDETAIL, params, null)
          .then(res => {
            if (this.deleteImgArr.length > 0) {
              this.deleteRequest();
            }
            this.$message({
              type: "success",
              message: "更新成功",
              duration: 2000
            });
            this.get_knowledge_detail(this.botCheckIndex);

            this.loading = false;
          })
          .catch(err => {
            this.loading = false;
            this.$message({
              type: "error",
              message: "更新失败",
              duration: 2000
            });
          });
      },

      // 删除按钮状态
      deletebtn(){
        if (this.textTotal==0 && this.uploadList.length===0) {
          this.disabled =true
        } else {
          this.disabled =false
        }
      },
      handleTip(v) {
        this.DeleteIds = [];
        this.deleteImgArr = [];
        this.editableStatus = v.name === "first";
        this.statusTest = v.name === "first" ? "friendly" : "basic";
        this.textTotal = v.name === "second" ? this.basicAnswer.length : this.friendlyAnswer.length;

        this.uploadList = this.detail.Friendly.Image.slice(0);
        this.uploadList2 =this.detail.Basic.Image.slice(0);

        this.deletebtn()
      },
      deleteRequest() {
        const that = this;
        const id = JSON.parse(sessionStorage.getItem('recordId'))
        const Id = id?id:this.$route.query.recordId
        const Files = [];

        this.deleteImgArr.forEach((v, index) => {
          const obj = {
            Context: v
          };
          Files.push(obj);
        });
        const body = {
          Command: "delete",
          Id,
          Files
        };

        const params = {
          body: JSON.stringify(body)
        };
        upload_delete_img(params).then(res => {
          that.deleteImgArr = [];
        });
      }
    }
  };
</script>
<style lang="scss" scoped>
  @import "../../../../../style/index";
  .deleteBtn{display:none;}
  .tapList {
    height: 48px;
    line-height: 48px;
    background: #f9fafc;
    padding-left: 12px;
    .firTap {
      width: 88px;
    }
    i {
      display: inline-block;
      height: 28px;
      width: 30px;
      margin-right: 10px;
    }
    span {
      display: inline-block;
      width: 160px;
    }

    .unChecked {
      color: #777;
      background: #f9fafc;
    }
    .text-a-c:hover {
      cursor: pointer;
      color: $primary-color;
    }
    .isChecked {
      color: $primary-color;
      background: #f0f2f7;
    }
  }
  .yoy-tabs {
    margin-top: 20px;
  }
  .yoy-tab-pane {
    height: 200px;
    margin: 20px 0;
    padding: 0 20px;
    overflow-y: scroll;
    box-sizing: border-box;
  }

  .picItem {
    width: 80px;
    height: 80px;
    margin-right: 20px;
    -webkit-border-radius: 6px;
    -moz-border-radius: 6px;
    border-radius: 6px;
    border: 1px solid #c0ccda;
    overflow: hidden;
  }
  .opacity {
    width: 100%;
    height: 100%;
    opacity: 0;
    background: rgba(0, 0, 0, 0);
    -webkit-border-radius: 6px;
    -moz-border-radius: 6px;
    border-radius: 6px;
    span {
      width: 100%;
      margin: 0 auto;
      height: 80px;
      line-height: 80px;
      text-align: center;
      color: #fff;
      i {
        display: inline-block;
        width: 28px;
        height: 28px;
        line-height: 28px;
        cursor: pointer;
      }
    }
  }
  .opacity:hover {
    opacity: 1;
    background: rgba(0, 0, 0, 0.5);
    transition: all 0.3s;
  }
  .buttonContainer {
    margin-top: 50px;
  }
  .tips {
    float: left;
    height: 80px;
    line-height: 80px;
  }
  .align-middle-img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: auto;
    max-width: 100%;
    height: auto;
    max-height: 100%;
  }
  .friend-answer {
    border: none;
    outline: none;
    width: 100%;
    resize: none;

  }
  .friend-answer::-webkit-input-placeholder {
    color: #999;
  }
</style>
