<template>
  <el-form ref="formData" label-width="38px" :model="formData" class="yoy-main full-height c555" v-loading="loading">
    <title-item title="网站中嵌入代码"></title-item>
    <el-form-item label="" class="margin-top30 margin-bottom-30">
      <el-col :span="23" class="borderAround htmlContent p-relative">
        <section>
          {{formData.Code}}
        </section>
        <el-button class="p-absolute yoy-button" type="primary" plain>
          复制
        </el-button>
      </el-col>
    </el-form-item>
    <title-item title="客服图标悬浮位置"></title-item>
    <el-form-item label="" class="margin-top30 margin-bottom-30">
      <el-col :span="24">
          <el-radio-group v-model="formData.Position" class="full-width">
            <el-col :span="6">
              <el-radio :label="1">右下角</el-radio>
            </el-col>
            <el-col :span="6">
              <el-radio :label="2">左下角</el-radio>
            </el-col>
            <el-col :span="6">
              <el-radio :label="3">右上角</el-radio>
            </el-col>
            <el-col :span="6">
              <el-radio :label="4">左上角</el-radio>
            </el-col>
        </el-radio-group>
      </el-col>
    </el-form-item>
    <title-item title="自定义机器人头像"></title-item>
    <el-form-item label="" class="margin-top30 margin-bottom-30">
      <el-radio-group v-model="formData.BotHeadPortrait" class="full-width">
          <el-col :span="6">
            <el-radio :label="0" class="align-middle margin-right-30">默认 : </el-radio>
            <img src="../../../../assets/header.png" alt="默认头像" class="align-middle ">
          </el-col>
          <el-col :span="18" class="">
            <el-radio :label="1" class="align-middle margin-right-30">自定义 : </el-radio>
            <section class="file-box f-s-11 c555 dis-i-b align-middle">
              <input type='file' accept="image/*" name="avatar" placeholder="上传" id="img" class="file-btn" @change="upLoadImg"/>选择文件
            </section>
            <img src="" alt="" id='preImg'>
          </el-col>
      </el-radio-group>
    </el-form-item>
    <title-item title="自定义标题栏背景颜色"></title-item>
    <el-form-item label="" class="margin-top30 margin-bottom-30 full-width">
      <el-col :span="12">
        <el-col :span="2" v-for="item in titleColorItems" :index="index">
          <span class="colorItem"
                :style="{background:item,opacity:item === titleCheckedColor?'1':'.5'}">
            <i class="el-icon-check c-fff f-w-500" :style="{display:item === titleCheckedColor?'inline-block':'none'}"></i>
          </span>
        </el-col>
      </el-col>
      <el-col :span="12">
        <el-col :span="8">
          自定义标题栏背景颜色 ：
        </el-col>
        <el-col :span="16">
          <el-input v-model="formData.DialogColor" placeholder="请输入标题栏背景色色值（如#999999）"></el-input>
        </el-col>
      </el-col>
    </el-form-item>
    <title-item title="自定义标题栏字体颜色"></title-item>
    <el-form-item label="" class="margin-top30 margin-bottom-30 full-width">
      <el-col :span="12">
        <el-col :span="2" v-for="item in textColorItems" :index="index">
          <span class="colorItem"
                :style="{background:item,border:item === '#fff'?'1px solid #eaedf1':'none',opacity:item === textCheckedColor?'1':'.5'}">
            <i class="el-icon-check c555 f-w-500" :style="{display:item === textCheckedColor?'inline-block':'none'}"></i>
          </span>
        </el-col>
      </el-col>
      <el-col :span="12">
        <el-col :span="8">
          自定义标题栏字体颜色 ：
        </el-col>
        <el-col :span="16">
          <el-input v-model="formData.DialogColor" placeholder="请输入标题栏背景色色值（如#999999）"></el-input>
        </el-col>
      </el-col>
    </el-form-item>
    <title-item title="功能开关"></title-item>
    <el-form-item label="">

    </el-form-item>
  </el-form>
</template>
<script>
  import TitleItem from '../../../../components/Title'
  export default {
    data(){
      return{
        formData:{
          Code:'',
          Position:'',
          BotHeadPortrait:'normal',
          disabled: true,
          DialogColor: '',
        },
        titleCheckedColor:'#3b65b7',
        textCheckedColor:'#fff',
        titleColorItems:['#3b65b7','#f45e63','#ff9800','#00beac','#2a8ce7','#9e3bc8','#673ab7'],
        textColorItems:['#fff','#f45e63','#ff9800','#00beac','#2a8ce7','#9e3bc8','#673ab7']
      }
    },
    name:'webTest',
    components:{
      TitleItem,
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
              console.info('====',that.formData); //这个就是base64的数据了
            };
          })(e.target.files[0]);
          reader.readAsDataURL(e.target.files[0]);
      },

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
</style>
