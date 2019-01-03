<template>
  <el-form ref="formData" :rules="rules" label-width="38px" :model="formData" class=" full-height c555 webpage" v-loading="loading">
    <title-item title="网站中嵌入代码"></title-item>
    <el-form-item label="" class="margin-top30 margin-bottom-30">
      <el-col :span="23" class="borderAround htmlContent p-relative">
        <section style="line-height: 1.5">
          {{formData.Code}}
        </section>
        <el-button id='copyBtn' class="p-absolute yoy-button" type="primary" plain @click="copyText">
          复制
        </el-button>
      </el-col>
    </el-form-item>
    <title-item title="客服图标悬浮位置"></title-item>
    <el-form-item label="" class="margin-top30 margin-bottom-30">
      <el-col :span="18">
          <el-radio-group v-model="formData.Position" class="full-width">
            <el-col :span="6">
              <el-radio label="right-down">右下角</el-radio>
            </el-col>
            <el-col :span="6">
              <el-radio label="left-down">左下角</el-radio>
            </el-col>
            <el-col :span="6">
              <el-radio label="right-up">右上角</el-radio>
            </el-col>
            <el-col :span="6">
              <el-radio label="left-up">左上角</el-radio>
            </el-col>
        </el-radio-group>
      </el-col>
    </el-form-item>
    <title-item title="自定义机器人头像"></title-item>
    <el-form-item label="" class="margin-top30 margin-bottom-30">
      <el-radio-group v-model="headerPicture" class="full-width" @change="changeHeaderImage">
          <el-col :span="9">
            <el-radio label="normal" class="align-middle margin-right-30">默认 : </el-radio>
            <img :src="defaultPicture" alt="默认头像" class="align-middle header">
          </el-col>
          <el-col :span="14" class="">
            <el-radio label="custom" class="align-middle margin-right-30 custom" style="margin-bottom: 0;">自定义 : </el-radio>
            <section class="file-box f-s-11 c555 dis-i-b align-middle" :style="{borderColor:headerPicture === 'custom'?'#2a8ce7':'#c0c4cc'}">
              <section :class="[headerPicture === 'custom'?'normal':'notAllow']">
                <input :disabled="fileDisabled" type='file' accept="image/*" name="avatar" placeholder="上传" id="img" class="file-btn" @change="upLoadImg"/>选择文件
              </section>
            </section>
            <img v-show="headerPicture === 'custom'&&formData.BotHeadPortrait" :src="formData.BotHeadPortrait" alt="自定义头像" class="align-middle header"/>
            <span class="tips" v-if="headerPicture === 'custom'">
               （图片大小不超过200KB）
            </span>
          </el-col>
      </el-radio-group>
    </el-form-item>
    <title-item title="自定义标题栏背景颜色"></title-item>
    <el-form-item label="" class="margin-top30 margin-bottom-30 full-width">
      <el-col :span="9">
        <el-col :span="2" v-for="item in titleColorItems" :index="index" >
          <span class="colorItem"
                :style="{background:item,opacity:item === DialogColor?'1':'.6'}"
                @click="changeColor('DialogColor',item)"
          >
            <i class="el-icon-check c-fff f-w-900" :style="{display:item === DialogColor?'inline-block':'none'}"></i>
          </span>
        </el-col>
      </el-col>
      <el-col :span="14">
          自定义标题栏背景颜色 ：
          <el-input v-model="formData.DialogColor" placeholder="请输入标题栏背景色色值（如#999999) " @blur="typeColor('DialogColor','titleColorItems')" style="width: 360px;"></el-input>
      </el-col>
    </el-form-item>
    <title-item title="自定义标题栏字体颜色"></title-item>
    <el-form-item label="" class="margin-top30 margin-bottom-30 full-width">
      <el-col :span="9">
        <el-col :span="2" v-for="item in textColorItems" :index="index">
          <span class="colorItem"
                :style="{background:item,border:item === '#FFFFFF'?'1px solid #eaedf1':'none',opacity:item === DialogTitleColor?'1':'.6'}"
                @click="changeColor('DialogTitleColor',item)"
          >
            <i class="el-icon-check c555 f-w-900" :style="{display:item === DialogTitleColor?'inline-block':'none',color:item === '#FFFFFF'?'#555':'white'}"></i>
          </span>
        </el-col>
      </el-col>
      <el-col :span="14">
          自定义标题栏字体颜色 ：
          <el-input v-model="formData.DialogTitleColor" placeholder="请输入标题栏字体色值（如#999999)" @blur="typeColor('DialogTitleColor','textColorItems')" style="width: 360px;"></el-input>
      </el-col>
    </el-form-item>
    <title-item title="功能开关"></title-item>
    <el-form-item label="" style="margin-bottom: 32px;margin-top: 18px;">
      <el-col :span="12" >
        <el-checkbox v-model="formData.LoginSwitch" style="width: 134px;">登录验证</el-checkbox>
        <span class="primary-color f-s-14 disabled">提示：开启后则需登录后才可进入网页版</span>
      </el-col>
    </el-form-item>
    <el-form-item label="" style="margin-bottom: 10px;display: none">
      <el-col :span="24">
        <el-radio-group style="width: 100%;">
          <el-col :span="9" style="height: 32px;line-height: 32px">
          <el-checkbox v-model="formData.knowledge" disabled style="width: 134px;">知识分类功能</el-checkbox>
            <el-radio :label="1" disabled>默认：自助导航</el-radio>
          </el-col>
            <el-col :span="15">
              <el-radio :label="2" disabled>自定义：</el-radio>
              <el-input placeholder="最多6个字符" disabled style="width: 360px;margin-right:10px;"></el-input>
              <a href="javascript:;" class="primary-color disabled f-s-14">什么是知识分类？</a>
            </el-col>
        </el-radio-group>
      </el-col>
    </el-form-item>
    <el-form-item label="" style="margin-bottom: 40px;display: none">
      <el-col :span="24">
        <el-radio-group style="width: 100%;">
          <el-col :span="9" style="height: 32px;line-height: 32px">
            <el-checkbox v-model="formData.demo" disabled style="width: 134px;">案例库</el-checkbox>
            <el-radio :label="1" disabled>默认：案例库</el-radio>
          </el-col>
          <el-col :span="15">
            <el-radio :label="2" disabled >自定义：</el-radio>
            <el-input placeholder="最多6个字符" disabled style="width: 360px;margin-right:10px;"></el-input>
            <a href="javascript:;" class="primary-color disabled f-s-14">什么是案例库？</a>
          </el-col>
        </el-radio-group>
      </el-col>
    </el-form-item>
    <title-item title="自定义问候语"></title-item>
    <el-form-item class="none-label" prop="DialogTitle" style='margin-top: 26px;margin-bottom: 26px;'>
      <span style="width:70px;" class="dis-i-b text-align-right" >
        对话框标题
      </span>
        <el-input v-model="formData.DialogTitle" maxlength="15" style="width: 60%;margin-left: 20px;">
          <span slot="suffix">最多15个字符 &nbsp;</span>
        </el-input>
    </el-form-item>
    <el-form-item label="" class="none-label" prop="DialogGreetings" style="margin-bottom: 50px;">
      <span style="width:70px;line-height: 32px;" class="dis-i-b text-align-right align-top" >
        问候语
      </span>
      <section class="dis-i-b full-width p-relative" style="width: 60%;padding-bottom: 5px;">
        <el-input class='sayHello' v-model="formData.DialogGreetings" type="textarea" :rows="5" maxlength="50" style="margin-left: 20px;">
        </el-input>
        <span class="p-absolute " style="bottom: 0;color:#c0c4cc;right: -20px;">最多50个字符 &nbsp;</span>
      </section>
    </el-form-item>
    <title-item title="添加授信域名"></title-item>
    <el-form-item label="" prop="AuthorizedAddress" style="margin-bottom:56px">
      <section style="margin-top: 20px;line-height: 36px;">请添加授信的来访IP地址或域名 <span class="c999">(例如：255.255.255.255)</span></section>
      <el-row>
        <el-col :span="18" style="padding-bottom: 5px">
          <el-input type="textarea" :rows="5" placeholder="多域名或IP请用英文半角分号隔开" v-model="formData.AuthorizedAddress"></el-input>
        </el-col>
     </el-row>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit('formData')">保存</el-button><el-button @click="preview">样式预览</el-button><el-tooltip class="item" effect="dark" content="保存后可预览最新样式" placement="top-start"><span class="previewIcon"><i class="el-icon-question f-s-16 c999" style="margin:10px"></i></span></el-tooltip>
    </el-form-item>
  </el-form>
</template>
<script>
  import TitleItem from '../../../../components/Title';
  import {IMAGE,html} from "./constants";
  import {request} from "../../../../serive/request";
  import URL from '../../../../host/baseUrl'
  import {WEBINFO,UPDATEWEB} from "../../../../constants/api";
  import {getCookies} from "../../../../utils/cookie";
  import {TOKEN,TENANTID} from "../../../../constants/constants";
  import{unhtml,htmlDecodeByRegExp} from "../../../../utils/utils";
  import store from '../../../../store/index'
  import {REPLACE} from "../../../../store/mutations";

  export default {
    data(){
      return{
        formData:{
          Code:'',
          Position:'right-down',
          BotHeadPortrait: IMAGE,
          disabled: true,
          DialogColor: '#3B65B7',
          DialogTitleColor:'#FFFFFF',
          LoginSwitch:true, //true 为需要 ，false 为不需要
          DialogTitle:'嗨聊智能服务机器人',
          DialogGreetings:'您好，我是小嗨，有什么可以帮助您？',
          AuthorizedAddress:'',
        },
        rules: {
          AuthorizedAddress:[{required: false, message: '请填写授信域名'}],
          DialogTitle:[{required: true, message: '请填写对话框标题'},{max:15,message:'最多15个字符'}],
          DialogGreetings:[{required: true, message: '请填写问候语'},{max:50,message:'最多30个字符'}],
        },
        DialogColor:'#3B65B7',
        DialogTitleColor:'#FFFFFF',
        textCheckedColor:'#FFFFFF',
        titleColorItems:['#3B65B7','#F45E63','#FF9800','#00BEAC','#2A8CE7','#9E3BC8','#673AB7'],
        textColorItems:['#FFFFFF','#F45E63','#FF9800','#00BEAC','#2A8CE7','#9E3BC8','#673AB7'],
        headerPicture:'normal',
        defaultPicture:IMAGE,
        loading:false,
        fileDisabled:true,
      }
    },
    name:'webTest',
    computed:{
    },
    components:{
      TitleItem,
    },
    created(){
      store.dispatch(REPLACE, {mainLoading: true,loadingText:null})
      const id = JSON.parse(sessionStorage.getItem('recordId'))
      const recordId = this.$route.query.recordId?this.$route.query.recordId:id
      const token =getCookies(TOKEN)
      const body = {
        recordId,
      }
      const option = {
        headers:{
          'Access-Token':token
        },
        method:"POST",
        body:JSON.stringify(body)
      }
      request(URL.requestHost+WEBINFO,option).then(
        (res) =>{
         // console.log("标记",res.WebChatSettingModel.Code)
          if(res.WebChatSettingModel.Code == null || res.WebChatSettingModel.Code == ""){
            this.validate("formData");
          }else{
            this.initData(res);
          }
        }
      )
    },
    methods: {
      upload(response, file, fileList){

      },
      preview(){
        const id = this.$route.query.recordId
        const host = 'https://'+window.location.host
        const url = `${host}/WebTalk/preview.html?id=${id}`
        window.open(url)
      },
      initData(res){
        const that = this
        //data 为返回值的form
        const data =res.WebChatSettingModel

        data.Code =  data.Code?htmlDecodeByRegExp(data.Code):null

        if(data.BotHeadPortrait){
          // 如果头像有数据
          that.headerPicture = data.BotHeadPortrait.substr(0,6)
          // 如果头像的状态为normal
          if(that.headerPicture === 'normal'){
            // 则将form表单的头像设置为默认头像
            data.BotHeadPortrait = IMAGE
            that.fileDisabled = true
          }else{
            data.BotHeadPortrait = data.BotHeadPortrait.substr(6,data.BotHeadPortrait.length-1)
            that.fileDisabled = false
          }
        }else{
          // 头像为null,设置状态为nomal,头像数据为IMAGE
          that.headerPicture = 'normal'
          data.BotHeadPortrait = IMAGE
        }

        // 判断form的头像数据状态为默认还是自定义
        for(let v in data){
          if(!data[v]){
            data[v] = that.formData[v]
          }
        }

        data.LoginSwitch = data.LoginSwitch === 1
        this.DialogTitleColor = data.DialogTitleColor?data.DialogTitleColor:this.DialogTitleColor
        this.DialogColor = data.DialogColor?data.DialogColor:this.DialogColor
        //对话框标题 判断是否有初始值
        data.DialogTitle = data.DialogTitle?data.DialogTitle:'嗨聊智能服务机器人'
        //问候语 判断是否有初始值
        data.DialogGreetings = data.DialogGreetings?data.DialogGreetings:'您好，我是小嗨，有什么可以帮助您？'
        //授信域名 判断是否有初始值
        data.AuthorizedAddress = data.AuthorizedAddress?data.AuthorizedAddress:''
        //头像位置是否有初始值
        data.Position = data.Position?data.Position:'right-down'
        //判断对话标题的颜色
        this.formData = data
        store.dispatch(REPLACE, {mainLoading: false})
      },
      upLoadImg(e) {
        // if(this.headerPicture === 'custom') {
          const that = this
          let files = e.target.files || e.dataTransfer.files;
          if (!files.length) return;
          if (files[0].type.indexOf("image") < 0) {
            this.$message({
              type:'error',
              message:'上传了非图片',
              duration:2000
            })
            return;
          }
          if (files[0].size > 200*1024) {
            this.$message({
              type:'error',
              message:"请上传200KB以内的图片",
              duration:2000
            })
            return;
          }
          // 图片压缩成base64
          const reader = new FileReader();
          reader.onload = (function (file) {
            return function (e) {
              that.formData.BotHeadPortrait = this.result
            };
          })(e.target.files[0]);
          reader.readAsDataURL(e.target.files[0]);
        // }
      },
      changeHeaderImage(v){
        //如果上传头像为自定义，则清空头像数据
        if(v === 'custom'){
          this.formData.BotHeadPortrait = ''
          this.fileDisabled = false
        }else{
          this.fileDisabled = true
        }
        //改变头像状态
        this.headerPicture = v
      },
      submit(formName) {
        const that = this
        that.$refs[formName].validate((valid) => {
          if (valid) {
            this.$confirm('确认保存?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              that.validate(formName)
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消保存'
              });
            });
          }else{
            return false;
          }
        })
      },
      validate(formName){
            this.loading = true;
            const recordId = this.$route.query.recordId
            const host = 'https://'+window.location.host
            const data  = JSON.parse(JSON.stringify(this.formData))

            const Code=`&lt;script id=&quot;bot&quot; type=&quot;text/javascript&quot; src=&quot;${host}/WebTalk/linkScript/bot.js&quot; dataposition=&quot;${data.Position}&quot; datahost=&quot;${host}&quot; dataid=&quot;${recordId}&quot; dataimg=&quot;${host}/WebTalk/linkScript/robot.png&quot; datatxt=&quot;机器人&quot;&gt;&lt;/script&gt;`

            this.formData.Code = htmlDecodeByRegExp(Code)

            const user = store.state.app.userInfo

            const BotHeadPortrait = this.headerPicture === 'normal'?'normal'+IMAGE:'custom'+data.BotHeadPortrait

            const UserInfo = {
              Email:user.Email,
              FullName:user.FullName
            }
            data.LoginSwitch = data.LoginSwitch === true?1:0
            const TenantId = getCookies(TENANTID)
            const newData = {
              "TenantId":TenantId,
              "BotConfigId":data.BotConfigId,
              "Position":data.Position,
              "BotHeadPortrait":BotHeadPortrait,
              "DialogColor":data.DialogColor, //#3B65B7
              'DialogTitleColor':data.DialogTitleColor,
              "DialogTitle":data.DialogTitle,
              "DialogGreetings":data.DialogGreetings,
              "AuthorizedAddress":data.AuthorizedAddress,
              "Code":Code,
              'UserInfo':UserInfo,
              LoginSwitch:data.LoginSwitch
            }
            this.submitForm(newData)

      },
      submitForm(data){
        const that = this
        const token =getCookies(TOKEN)
        const body = {
            ...data,
        }
        const option = {
          headers:{
            'Access-Token':token
          },
          method:"POST",
          body:JSON.stringify(body)
        }
        request(URL.requestHost+UPDATEWEB,option).then(
          (res) =>{
            that.$message({
              type: 'success',
              message: '保存成功',
              duration: 2000,
              onClose:() =>{
                that.loading = false;
              }
            })
          }
        ).catch(
          ()=>{
            that.$message({
              type: 'error',
              message: '保存失败',
              duration: 2000,
              onClose:() => {
                that.loading = false;
              }
            })
          }
        )
      },
      changeColor(key,v){
        this[key] = v.toUpperCase()
        this.formData[key] = v.toUpperCase()
      },
      copy(str){
        var save = function (e){
          e.clipboardData.setData('text/plain',str);//下面会说到clipboardData对象
          e.preventDefault();//阻止默认行为
        }
        document.addEventListener('copy',save);
        document.execCommand("copy");//使文档处于可编辑状态，否则无效
      },
      copyText(){
        this.copy(this.formData.Code)
      },
      typeColor(key,arr){
        const status = this[arr].includes(this.formData[key])
        if(status){
          this[key] = this.formData[key]
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import '../../../../style/index';
  .margin-top30{
    margin-top: 30px;
  }
  .margin-bottom-30{
    margin-bottom: 30px;
  }
  .margin-right-30{
    margin-right: 30px;
  }
  .htmlContent{
    padding:10px 18px 40px 18px;
    min-height: 100px;
    section{
      font-size:10px;
      line-height: 24px;
    }
  }
  .yoy-button{
    bottom:10px;
    right:18px;
    padding-left:30px;
    padding-right:30px;
    background: #fff;
  }
  .file-box{
    font-size: 12px;
    -webkit-border-radius: 2px;
    -moz-border-radius: 2px;
    border-radius: 2px;
    width: 80px;
    height: 30px;
    box-sizing: border-box;
    line-height: 28px;
    text-align: center;
    display: inline-block;
    position: relative;
    overflow: hidden;
    color:$primary-color;
    background-color: #fff;
    border:1px solid #c0c4cc;
    cursor:pointer;
    margin-right: 20px;
    .notAllow{
       color:#c0c4cc;
        cursor: pointer;
     }
    .notAllow:hover{
       color:#c0c4cc;
       background: #fff;
     }
  }
  .normal:hover{
      background: $primary-color;
      color:#fff;
    }
  .file-box:hover{
    cursor:pointer;
    /*color:#fff !important;*/
  }
  .file-btn{
    width: 100%;
    height: 100%;
    cursor:pointer;
    text-align: center;
    position: absolute;
    top: 0;
    left: 0;
    outline: none;
    filter:alpha(opacity=0);
    -moz-opacity:0;
    -khtml-opacity: 0;
    opacity: 0;
  }
  .file-btn:hover{
    cursor: pointer;
  }
  .colorItem{
    display: inline-block;
    width: 27px;
    height:16px;
    line-height: 16px;
    text-align: center;
    vertical-align: middle;
    border-radius:2px;
    opacity: .5;
    cursor: pointer;
  }
  .text-align-right{
    text-align: right;
  }
  .custom{
    height: 42px;
    line-height: 42px;
  }
  .header{
    display: inline-block;
    width: 42px;
    height: 42px;
  }
  .f-w-900{
    font-weight: 900;
  }
  .align-top{
    vertical-align: top;
  }
  .tips{
    color:#c3c3c3;
    font-size: 12px;
    vertical-align: middle;
  }
  .previewIcon:hover{
    cursor: pointer;
  }
</style>
<style>
  .webpage textarea {
    padding-left: 10px;
  }
</style>
