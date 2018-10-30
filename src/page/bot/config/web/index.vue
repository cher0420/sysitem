<template>
  <el-form ref="formData" :rules="rules" label-width="38px" :model="formData" class="yoy-main full-height c555" v-loading="loading">
    <title-item title="网站中嵌入代码"></title-item>
    <el-form-item label="" class="margin-top30 margin-bottom-30">
      <el-col :span="23" class="borderAround htmlContent p-relative">
        <section>
          {{formData.Code}}
        </section>
        <el-button id='copyBtn' class="p-absolute yoy-button" type="primary" plain @click="copyText">
          复制
        </el-button>
      </el-col>
    </el-form-item>
    <title-item title="客服图标悬浮位置"></title-item>
    <el-form-item label="" class="margin-top30 margin-bottom-30">
      <el-col :span="24">
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
          <el-col :span="6">
            <el-radio label="normal" class="align-middle margin-right-30">默认 : </el-radio>
            <img :src="defaultPicture" alt="默认头像" class="align-middle header">
          </el-col>
          <el-col :span="18" class="">
            <el-radio label="custom" class="align-middle margin-right-30 custom">自定义 : </el-radio>
            <section v-show="headerPicture === 'custom'" class="file-box f-s-11 c555 dis-i-b align-middle">
              <input type='file' accept="image/*" name="avatar" placeholder="上传" id="img" class="file-btn" @change="upLoadImg"/>选择文件
            </section>
            <img v-show="headerPicture === 'custom'&&formData.BotHeadPortrait" :src="formData.BotHeadPortrait" alt="自定义头像" class="align-middle header">
          </el-col>
      </el-radio-group>
    </el-form-item>
    <title-item title="自定义标题栏背景颜色"></title-item>
    <el-form-item label="" class="margin-top30 margin-bottom-30 full-width">
      <el-col :span="12">
        <el-col :span="2" v-for="item in titleColorItems" :index="index" >
          <span class="colorItem"
                :style="{background:item,opacity:item === DialogColor?'1':'.6'}"
                @click="changeColor('DialogColor',item)"
          >
            <i class="el-icon-check c-fff f-w-900" :style="{display:item === DialogColor?'inline-block':'none'}"></i>
          </span>
        </el-col>
      </el-col>
      <el-col :span="12">
        <el-col :span="8">
          自定义标题栏背景颜色 ：
        </el-col>
        <el-col :span="16">
          <el-input v-model="formData.DialogColor" placeholder="请输入标题栏背景色色值（如#999999) " @blur="typeColor('DialogColor','titleColorItems')"></el-input>
        </el-col>
      </el-col>
    </el-form-item>
    <title-item title="自定义标题栏字体颜色"></title-item>
    <el-form-item label="" class="margin-top30 margin-bottom-30 full-width">
      <el-col :span="12">
        <el-col :span="2" v-for="item in textColorItems" :index="index">
          <span class="colorItem"
                :style="{background:item,border:item === '#FFFFFF'?'1px solid #eaedf1':'none',opacity:item === DialogTitleColor?'1':'.6'}"
                @click="changeColor('DialogTitleColor',item)"
          >
            <i class="el-icon-check c555 f-w-900" :style="{display:item === DialogTitleColor?'inline-block':'none',color:item === '#FFFFFF'?'#555':'white'}"></i>
          </span>
        </el-col>
      </el-col>
      <el-col :span="12">
        <el-col :span="8">
          自定义标题栏字体颜色 ：
        </el-col>
        <el-col :span="16">
          <el-input v-model="formData.DialogTitleColor" placeholder="请输入标题栏字体色值（如#999999)" @blur="typeColor('DialogTitleColor','textColorItems')"></el-input>
        </el-col>
      </el-col>
    </el-form-item>
    <title-item title="功能开关"></title-item>
    <el-form-item label="">
      <el-col :span="5">
        <el-checkbox v-model="formData.LoginSwitch">登录验证</el-checkbox>
      </el-col>
      <span class="primary-color f-s-14">提示：开启后则需登录后才可进入网页版</span>
    </el-form-item>
    <el-form-item label="">
      <el-col :span="3">
        <el-checkbox v-model="formData.knowledge" disabled>知识分类功能</el-checkbox>
      </el-col>
      <el-col :span="9">
        <el-radio-group class="full-width">
          <el-col :span="18">
            <el-radio :label="1" disabled>默认：自助导航</el-radio>
          </el-col>
          <el-radio :label="2" disabled>自定义：</el-radio>
        </el-radio-group>
      </el-col>
      <el-col :span="11">
        <el-col :span="15">
          <el-input placeholder="最多6个字符" disabled></el-input>
        </el-col>
        <el-col :span="6" offset="1">
          <a href="javascript:;" class="primary-color">什么是知识分类？</a>
        </el-col>
      </el-col>
    </el-form-item>
    <el-form-item label="">
      <el-col :span="3">
        <el-checkbox v-model="formData.demo" disabled>案例库</el-checkbox>
      </el-col>
      <el-col :span="9">
        <el-radio-group class="full-width">
          <el-col :span="18">
            <el-radio :label="1" disabled>默认：案例库</el-radio>
          </el-col>
          <el-radio :label="2" disabled>自定义：</el-radio>
        </el-radio-group>
      </el-col>
      <el-col :span="11">
        <el-col :span="15">
          <el-input placeholder="最多6个字符" disabled></el-input>
        </el-col>
        <el-col :span="6" offset="1">
          <a href="javascript:;" class="primary-color">什么是案例库？</a>
        </el-col>
      </el-col>
    </el-form-item>
    <title-item title="自定义问候语"></title-item>
    <el-form-item label="" class="margin-top30" prop="DialogTitle">
      <el-col :span="2" class="text-align-right">
        对话框标题：
      </el-col>
      <el-col :span="15">
        <el-input v-model="formData.DialogTitle">
          <span solt="suffix">最多15个字符</span>
        </el-input>
      </el-col>
    </el-form-item>
    <el-form-item label="" class="margin-top30" prop="DialogGreetings">
      <el-col :span="2" class="text-align-right">
        问候语：
      </el-col>
      <el-col :span="15">
        <el-input v-model="formData.DialogGreetings" type="textarea" :rows="5">
          <span solt="suffix">最多30个字符</span>
        </el-input>
      </el-col>
    </el-form-item>
    <title-item title="添加授信域名"></title-item>
    <el-form-item label=" " prop="AuthorizedAddress">
      <section>仅支持已添加的授信余名或IP地址的URL访问 <span class="c999">(授信域名： www...  IP地址：192.888.8.8)</span></section>
      <el-row>
        <el-col :span="18">
          <el-input type="textarea" :rows="5" placeholder="请输入授信域名" v-model="formData.AuthorizedAddress"></el-input>
        </el-col>
     </el-row>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit('formData')">保存</el-button>
      <el-button >预览</el-button>
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
  import {TOKEN} from "../../../../constants/constants";
  import{unhtml,htmlDecodeByRegExp} from "../../../../utils/utils";
  import store from '../../../../store/index'

  export default {
    data(){
      return{
        formData:{
          Code:'',
          Position:'right-down',
          BotHeadPortrait: IMAGE,
          disabled: true,
          DialogColor: '#3B65B7',
          DialogTitleColor:'#555555',
          LoginSwitch:true, //true 为需要 ，false 为不需要
          DialogTitle:'小华智能助理',
          DialogGreetings:'您好，我是小华，有什么可以帮助您？',
          AuthorizedAddress:'',
        },
        rules: {
          AuthorizedAddress:[{required: true, message: '请填写授信域名!'}],
          DialogTitle:[{required: true, message: '请填写对话框标题!'}],
          DialogGreetings:[{required: true, message: '请填写问候语!'}],
        },
        DialogColor:'#3B65B7',
        DialogTitleColor:'#FFFFFF',
        textCheckedColor:'#FFFFFF',
        titleColorItems:['#3B65B7','#F45E63','#FF9800','#00BEAC','#2A8CE7','#9E3BC8','#673AB7'],
        textColorItems:['#FFFFFF','#F45E63','#FF9800','#00BEAC','#2A8CE7','#9E3BC8','#673AB7'],
        headerPicture:'normal',
        defaultPicture:IMAGE,
      }
    },
    name:'webTest',
    components:{
      TitleItem,
    },
    created(){
      const recordId = this.$route.query.recordId
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
          const data =res.WebChatSettingModel
          data.Code =  htmlDecodeByRegExp(data.Code)
          this.headerPicture = data.BotHeadPortrait.substr(0,5) === 'normal'?'normal':'custom'
          const BotHeadPortrait = data.BotHeadPortrait.substr(6,data.BotHeadPortrait.length-1)
          data.BotHeadPortrait = BotHeadPortrait
          data.LoginSwitch = data.LoginSwitch !== 0
          this.DialogTitleColor = data.DialogTitleColor
          this.DialogColor = data.DialogColor
          this.formData = data
        }
      )
    },
    methods: {
      upload(response, file, fileList){
        console.log(response, file, fileList)
      },
      upLoadImg(e) {
        const that = this
        let files = e.target.files || e.dataTransfer.files;
        if (!files.length) return;
        if (files[0].type.indexOf("image") < 0) {
          alert("上传了非图片");
          return;
        }
        if (files[0].size > 5 * 1000000) {
          alert("上传文件过大");
          return;
        }
        // 图片压缩成base64
          const reader = new FileReader();
          reader.onload = (function (file) {
            return function (e) {
              that.formData.BotHeadPortrait =this.result
              console.log(that.formData.BotHeadPortrait)
            };
          })(e.target.files[0]);
          reader.readAsDataURL(e.target.files[0]);
      },
      changeHeaderImage(v){
        this.headerPicture = v
      },
      submit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const recordId = this.$route.query.recordId
            const host = 'https://'+window.location.host
            const data  = JSON.parse(JSON.stringify(this.formData))
            const Code=`&lt;script id=&quot;bot&quot; type=&quot;text/javascript&quot; src=&quot;&quot; dataposition=&quot;${data.Position}&quot; datahost=&quot;${host}&quot; dataid=&quot;${recordId}&quot; dataimg=&quot;${host}/Content/images/logo.jpg&quot; datatxt=&quot;&quot;&gt;&lt;/script&gt;`
            this.formData.Code = htmlDecodeByRegExp(Code)

            const user = store.state.app.userInfo

            const BotHeadPortrait =this.headerPicture === 'normal'?'normal'+IMAGE:'custom'+data.BotHeadPortrait
            console.log('=====',data)

            const UserInfo = {
              Email:user.Email,
              FullName:user.FullName
            }
            data.LoginSwitch = data.LoginSwitch === true?1:0
            const newData = {
              "TenantId":data.TenantId,
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
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      submitForm(data){
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
            console.log(res)
          }
        )
      },
      changeColor(key,v){
        this[key] = v.toUpperCase()
        this.formData[key] = v.toUpperCase()
        console.log(v)
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
          console.log(key,this[key])
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
  .yoy-upload{
    /*display: inline-block;*/
    /*width: 80px ;*/
    /*height: 30px;*/
    /*line-height: 30px;*/
    /*border: 1px solid #ccc;*/
    /*background-size: contain;*/
    /*background-repeat: no-repeat;*/
    /*background-position: center center;*/
  }
  .file-box{
    font-size: 12px;
    -webkit-border-radius: 2px;
    -moz-border-radius: 2px;
    border-radius: 2px;
    width: 80px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    display: inline-block;
    position: relative;
    overflow: hidden;
    color:$primary-color;
    background-color: #fff;
    border:1px solid $primary-color;
    cursor:pointer;
    margin-right: 20px;
  }
  .file-box:hover{
    background-color: $primary-color;
    color:#fff;
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
</style>
