<template>
  <section class="yoy-main c999 f-s-14">
    <section class="tapList">
      <span class="firTap">选择渠道：</span>
      <span v-for="(data,key) in tapList"  class="text-a-c" v-bind:class="{isChecked:key === botCheckIndex}" @click="handleClick(key)" :index="key">
        <i :style="{background: key === botCheckIndex?
        'url(' + require(`../../../../assets/bot/${key}Checked.png`) + ')center center no-repeat':
          'url(' + require(`../../../../assets/bot/${key}.png`) + ')center center no-repeat'
        }" alt="" class="align-middle"></i>
        {{data}}
      </span>
    </section>
    <el-row v-loading="loading">
      <el-tabs v-model="activeName2" type="card" @tab-click="handleTip" class="yoy-tabs">
        <el-tab-pane label="标准回答" name="second" class="yoy-tab-pane" v-html="BasicText">
        </el-tab-pane>
        <el-tab-pane label="友好回答" name="first" class="yoy-tab-pane">
          <textarea
            class="c999 friend-answer"
            rows="8" cols="10"
            placeholder="请输入自定义友好回答，最多500字符"
            v-model="friendlyAnswer"
            @input="getTextTotal"
            v-bind:maxlength="500"
          >
          </textarea>
          <span style="    display: inline-block;
    width: 100%;
    text-align: right;
    position: absolute;
    right: 20px;
    bottom: 20px;">{{textTotal}}/500字</span>
        </el-tab-pane>
      </el-tabs>
      <section>
      </section>
      <section class="uploadContainer" v-show="editableStatus">
        <el-row class="el-upload-list el-upload-list--picture-card" style="float: left;">
          <el-col v-for="(item,index) in uploadList"  class="p-relative picItem text-a-c">
            <img :src="item.KnowledgeBase" alt="知识回答内容图片" class="align-middle-img"/>
            <section class="p-absolute opacity f-s-20">
              <span class="dis-i-b">
                <i class="el-icon-zoom-in" @click="preview(item.KnowledgeBase)"></i>
                <i class="el-icon-delete" @click="handleDel(item,index)"></i>
              </span>
            </section>
          </el-col>
        </el-row>
        <section>
          <section>
            <section v-show="uploadList.length<3" class="el-upload el-upload--picture-card" @click="uploadContainer" style="float: left;margin-right: 20px">
              <i class="el-icon-plus">
              </i>
              <input type="file" class="el-upload__input" style="display: none" ref="yoy-image-upload" accept="image/*" @change="uploadHandle">
            </section>
            <section class="tips">
              (上传照片，支持jpg,jpeg,png,gif,svg格式，最大不超过200k,最多3张)
            </section>
          </section>
          <el-button type="primary" class="save" @click="save">保存</el-button>
        </section>
        <el-dialog :visible.sync="dialogVisible" class="text-a-c">
          <img width="400" :src="dialogImageUrl" alt="">
        </el-dialog>
      </section>
    </el-row>
  </section>
</template>
<script>
import store from '../../../../store/index'
import {REPLACE} from "../../../../store/mutations";
import {handleDetail} from './service';
import URL from '../../../../host/baseUrl'
import {BOTKNOWDETAIL,UPDATEKNOWDETAIL} from "../../../../constants/api";
import {upload_delete_img} from "../../../../serive/request";
import {TENANTID,USERNAME} from "../../../../constants/constants";
import {getCookies} from "../../../../utils/cookie";

export default {
    data(){
      return{
        detail:{},
        BasicText:'',
        activeName2: 'first',
        botCheckIndex: 'WeChat',
        tapList: {Wechat:'微信端',WebChat:'网页端',DeskTopChat:'桌面',Robot:'实体机器人'},
        dialogImageUrl: '',
        dialogVisible: false,
        uploadList:[],
        friendlyAnswer:'',
        editableStatus: true,
        loading: false,
        DeleteIds:[],
        deleteImgArr:[],
        textTotal:0
      }
    },
    destroyed(){
        store.dispatch(REPLACE,{navIndexSecond:''})
    },
    created(){
      const query = this.$route.query
      const botCheckIndex = query.botCheckIndex // 选中项
      this.botCheckIndex = botCheckIndex
      this.get_knowledge_detail(botCheckIndex)

    },
    methods: {
      getTextTotal(){
        this.textTotal = this.friendlyAnswer.length
      },
      get_knowledge_detail(channel){
        this.loading = true
        const query = this.$route.query
        const body = {
          BotConfigRecordId:query.recordId,
          Data:{
            IntentName:query.title, // 意图
            Channels:channel, //渠道
          }
        }
        const params = {
          body:JSON.stringify(body)
        }
        handleDetail(URL.requestHost+BOTKNOWDETAIL,params,'Data').then(
          (res) => {
            this.detail = res
            const BasicText = res.Basic.Text[0].KnowledgeBase
            this.BasicText = BasicText.replace(/\n+/g, "<br/>")
            this.friendlyAnswer = res.Friendly.Text[0].KnowledgeBase
            this.textTotal = this.friendlyAnswer.length
            const images = res.Friendly.Image
            this.uploadList = images
            this.loading=false
          }
        )
      },
      handleClick(v) {
        this.botCheckIndex=v
        this.get_knowledge_detail(v)
      },
      preview(v){
        this.dialogVisible = true
        this.dialogImageUrl = v
      },
      confirm(v,index) {
        const that = this
        that.$confirm('确认要删除此图片?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.del(v,index)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      del(v,index){
        const arr = this.uploadList
        arr.splice(index,1)
        if(v.ID){
          this.DeleteIds.push(v.ID)
          this.deleteImgArr.push(v.KnowledgeBase)
        }
      },
      handleDel(v,index){
        this.confirm(v,index)
      },
      uploadHandle(v){
        const that = this
        const file = v.target.files[0];
        debugger;
          if(!file||file.size>200*1024){
            this.$message({
              type: 'error',
              message: '请上传文件不大于200KB的图片！'
            })
            return;
          }
          // 读取文件:
          const reader = new FileReader();
          //初始化图像对象
          let obj = {}
        //获取文件名字
        const name = file.name
          reader.onload = function(e) {
            const KnowledgeBase = e.target.result;
            //获取文件base64内容
            // const url = str.match(/base64,(\S*)/)[1]
            //图像对象赋值
            const type = name.substring(name.lastIndexOf(".")).replace('.','')
            obj = {
              name,
              KnowledgeBase,
              type,
            }

            that.uploadList.push(obj)

            that.$refs['yoy-image-upload'].value = ''
          };
          // 以DataURL的形式读取文件:
          reader.readAsDataURL(file);
        // });
      },
      uploadContainer(v){
        const input = this.$refs['yoy-image-upload']
        input.click()
        // 监听change事件:
      },
      save(){
        this.loading = true
        const that = this

        this.$confirm('确定保存以上信息?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.upload_img()
        }).catch(() => {
          that.loading = false
          this.$message({
            type: 'info',
            message: '取消保存'
          });
        });
      },
      upload_img(){
        const Id = this.$route.query.recordId
        const Files = []

        let imageArr = this.uploadList.slice(0)
        imageArr.forEach(
          (v,key,arr) => {
            if(v.KnowledgeBase.match(/base64,(\S*)/)){
              const Context = v.KnowledgeBase.match(/base64,(\S*)/)[1]
              const obj = {
                Context,
                Suffix:v.type
              }
              Files.push(obj)
              imageArr.splice(key,1)
            }
          }
        )
        const body ={
          Command: 'upload',
          Id,
          Files
        }
        const params = {
          body: JSON.stringify(body)
        }
        upload_delete_img(params).then((res) => {
          const arr = []
          res.FilesName.forEach(
            (v,k) => {
              const obj = {
                KnowledgeBase : v,
                Id : ''
              }
              arr.push(obj)
            }
          )
          const _image_arr = [...arr,...imageArr]

          this.update_Detail(_image_arr)
        })
      },
      update_Detail(arr){
        const CreateUserId = getCookies(TENANTID)
        const CreateUserName = getCookies(USERNAME)
        const BotConfigRecordId = this.$route.query.recordId
        const IntentID = this.$route.query.IntentID
        const Channels = this.botCheckIndex
        const KnowledgeBase = this.friendlyAnswer
        const text = this.detail.Friendly.Text[0]
        const DeleteIds = this.DeleteIds

        const options ={
          BotConfigRecordId,
          "Data":{
            IntentID,
            DeleteIds,
            Channels,
            "Text":{
              ...text,
              KnowledgeBase
            },
            "Image":arr,
            "Video":[
              {
                "ID":"",
                "KnowledgeBase":""
              }
            ],
            "Media":[
              {
                "ID":"",
                "KnowledgeBase":""
              }
            ],
            CreateUserId,
            CreateUserName
        }
      }
      const params = {
          body: JSON.stringify(options)
      }
        handleDetail(URL.requestHost+UPDATEKNOWDETAIL,params,null).then(
          (res) =>{
            console.log(this.uploadList)
            this.deleteRequest()
            this.loading = false
            this.$message({
              type: 'success',
              message: '更新成功',
              duration: 2000,
            });
          }
        ).catch(
          (err) => {
            this.loading = false
            this.$message({
              type: 'error',
              message: '更新失败',
              duration: 2000,
            });
          }
        )
      },
      handleTip(v){
        this.DeleteIds = []
        this.deleteImgArr = []

        this.editableStatus=v.name === 'first'
      },
      deleteRequest(){
        const Id = this.$route.query.recordId
        const Files = []
        this.deleteImgArr.forEach(
          (v,index) =>{
            const obj = {
              Context:v
            }
            Files.push(obj)
          }
        )
        const body ={
          Command: 'delete',
          Id,
          Files,
        }
        const params = {
          body: JSON.stringify(body)
        }
        upload_delete_img(params).then((res) => {

        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../../../style/index";

  .tapList{
    height: 48px;
    line-height: 48px;
    background: #f9fafc;
    padding-left: 12px;
    .firTap{
      width: 88px;
    }
    i{
      display: inline-block;
      height: 28px;
      width: 30px;
      margin-right: 10px;
    }
    span{
      display: inline-block;
      width: 160px;
    }

    .unChecked{
      color: #777;
      background: #f9fafc;
    }
    .text-a-c:hover{
      cursor: pointer;
      color: $primary-color;
    }
    .isChecked{
      color: $primary-color;
      background: #f0f2f7;
    }
  }
  .yoy-tabs{
    margin-top: 20px;
  }
  .yoy-tab-pane{
    height: 200px;
    margin: 20px 0;
    padding: 0 20px;
    overflow-y: scroll;
    box-sizing: border-box;
  }

  .uploadContainer{
    margin-top: 20px;
  }
  .picItem{
    width: 80px;
    height: 80px;
    margin-right: 20px;
    -webkit-border-radius: 6px;
    -moz-border-radius: 6px;
    border-radius: 6px;
    border: 1px solid #c0ccda;
  }
  .opacity{
    width: 100%;
    height: 100%;
    opacity: 0;
    background: rgba(0,0,0,0);
    -webkit-border-radius: 6px;
    -moz-border-radius: 6px;
    border-radius: 6px;
    span{
      width: 100%;
      margin: 0 auto;
      height: 80px;
      line-height: 80px;
      text-align: center;
      color:#fff;
      i{
        display: inline-block;
        width: 28px;
        height: 28px;
        line-height: 28px;
        cursor: pointer;
      }
    }
  }
  .opacity:hover{
    opacity: 1;
    background: rgba(0,0,0,.5);
    transition:all .3s;
  }
  .save{
    float: right;
    margin-top: 22px;
  }
  .tips{
    float: left;
    height: 80px;
    line-height: 80px;
  }
  .align-middle-img{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    width: auto;
    max-width: 100%;
    height: auto;
    max-height: 100%;
  }
  .friend-answer{
    border: none;
    outline:none;
    width: 100%;
    resize:none;
  }
  .friend-answer::-webkit-input-placeholder{color:#999;}
</style>
