<template>
  <section class="yoy-main c777">
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
    <el-tabs v-model="activeName2" type="card" @tab-click="handleTip" class="yoy-tabs">
      <el-tab-pane label="标准回答" name="second" class="yoy-tab-pane" v-html="BasicText">
      </el-tab-pane>
      <el-tab-pane label="友好回答" name="first" class="yoy-tab-pane">
        <textarea
          class="c777 friend-answer"
          rows="10" cols="10"
          placeholder="请输入内容"
          v-model="friendlyAnswer"
        >
        </textarea>
      </el-tab-pane>
    </el-tabs>
    <section>

    </section>
    <section class="uploadContainer">
      <el-row class="el-upload-list el-upload-list--picture-card" style="float: left;">
        <el-col v-for="(item,index) in uploadList"  class="p-relative picItem text-a-c">
          <img :src="item.url" alt="知识回答内容图片" class="align-middle-img"/>
          <section class="p-absolute opacity f-s-20">
            <span class="dis-i-b">
              <i class="el-icon-zoom-in" @click="preview(item.url)"></i>
              <i class="el-icon-delete" @click="handleDel(item.url,index)"></i>
            </span>
          </section>
        </el-col>
      </el-row>
      <section>
        <section>
          <section v-show="uploadList.length<3" class="el-upload el-upload--picture-card" @click="uploadContainer" style="float: left;margin-right: 20px">
            <i class="el-icon-plus">
            </i>
            <input type="file" class="el-upload__input" ref="yoy-image-upload" accept="image/*" @change="uploadHandle">
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
  </section>
</template>
<script>
import store from '../../../../store/index'
import {REPLACE} from "../../../../store/mutations";
import {handleDetail} from './service';
import URL from '../../../../host/baseUrl'
import {BOTKNOWDETAIL,UPDATEKNOWDETAIL} from "../../../../constants/api";
import {upload_delete_img} from "../../../../serive/request";

export default {
    data(){
      return{
        detail:{},
        BasicText:'',
        activeName2: 'first',
        botCheckIndex: 'WeChat',
        tapList: {Wechat:'微信端',WebChat:'网页端',DeskTopChat:'桌面',Robot:'实体机器人'},
        str:'',
        dialogImageUrl: '',
        dialogVisible: false,
        uploadList:[],
        friendlyAnswer:'',
        imgUrl:[]
      }
    },
    destroyed(){
        store.dispatch(REPLACE,{navIndexSecond:''})
    },
    created(){
      this.get_knowledge_detail()
      // const botIndex = this.$route.query.botIndex
      // const str = detail[botName][botIndex]
      // this.str=str.replace(/\n+/g, "<br/>")
    },
    methods: {
      get_knowledge_detail(){
        const query = this.$route.query
        const botCheckIndex = query.botCheckIndex
        this.botCheckIndex = botCheckIndex
        const body = {
          BotConfigRecordId:query.recordId,
          Data:{
            IntentName:query.title, // 意图
            Channels:query.botCheckIndex, //渠道
          }
        }
        const params = {
          body:JSON.stringify(body)
        }
        handleDetail(URL.requestHost+BOTKNOWDETAIL,params,'Data').then(
          (res) => {
            this.detail = res
            this.BasicText = res.Basic.Text[0].KnowledgeBase
            this.friendlyAnswer = res.Friendly.Text[0].KnowledgeBase
            const images = res.Friendly.Image
            images.forEach(
              (value,key) => {
                // value.url = value.KnowledgeBase
                // value.url = 'https://hightalksqsw2staging.blob.core.windows.net/picturecontainer/6e93bdf7-d49b-4ee4-94e7-28fe5882664a/636788281303336106.svg'
                value.url = 'https://hightalksqsw2staging.blob.core.windows.net/picturecontainer/6e93bdf7-d49b-4ee4-94e7-28fe5882664a/636788286214785551.png'
              }
            )
            this.uploadList = images
          }
        )
      },
      handleClick(v) {
        this.botCheckIndex=v
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
          that.delRequest(v,index)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      delRequest(v,index){
        const arr = this.uploadList
        arr.splice(index,1)
        const body ={
          Command: 'delete',
        }
        const params = {
          body: JSON.stringify(body)
        }
        upload_delete_img(params).then((res) => {
          this.uploadList = [
            ...this.uploadList,
            ...res.FilesName,
          ]
        })
      },
      handleDel(v,index){
        this.confirm(v,index)
      },
      uploadHandle(v){
        const that = this
        const file = v.target.files[0];
          if(!file){
            return;
          }
          // 读取文件:
          const reader = new FileReader();
          //初始化图像对象
          let obj = {}
        //获取文件名字
        const name = file.name
          reader.onload = function(e) {
            const url = e.target.result;
            //获取文件base64内容
            // const url = str.match(/base64,(\S*)/)[1]
            //图像对象赋值
            const type = name.substring(name.lastIndexOf(".")).replace('.','')
            obj = {
              name,
              url,
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
        const that = this
        // that.upload_img()
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.upload_img()
        }).catch(() => {

        });
      },
      upload_img(){
        const Id = this.$route.query.recordId
        const Files = []
        let imageArr = this.uploadList.slice(0)
        imageArr.forEach(
          (v,key,arr) => {
            if(v.url.match(/base64,(\S*)/)){
              const Context = v.url.match(/base64,(\S*)/)[1]
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
          imageArr.forEach(
            (v,key) => {
              arr.push(v.url)
            }
          )
          const content = [...arr,...res.FilesName]
          console.log('imageArr',content)
          this.update_Detail(content)
        })
      },
      update_Detail(params){
        const BotConfigRecordId = this.$route.query.recordId
        const ID = this.detail.Friendly.Text[0].ID
        const KnowledgeBase = this.friendlyAnswer
        const options =
          {
            BotConfigRecordId,
            "Data":{
              "BaseModels":[{
                ID,
                KnowledgeBase,
              }]
            }}
        handleDetail(URL.requestHost+UPDATEKNOWDETAIL,null).then(
          (res) =>{

          }
        )
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
</style>
