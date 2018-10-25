<template>
  <el-form ref="form" label-width="120px" :model="form" class="yoy-main full-height c555">
    <section class="title f-s-16 c555 box-sizing margin-b-30px">
      基础设置
    </section>
    <el-form-item label="URL :">
      <el-col :span="20">
        <section>{{form.url}}</section>
      </el-col>
    </el-form-item>
    <el-form-item label="Token :">
      <el-col :span="20">
        <el-input v-model="form.Token"></el-input>
        <section class="f-s-11 c999">请将URL和Token复制到您的微信公众平台账号开发模式下的接口配置中</section>
      </el-col>
    </el-form-item>
    <el-form-item label="" class="margin-b-40">
      <el-col :span="20" class="tip f-s-11 c999 box-sizing">
        <section>
          <i class="el-icon-question f-s-16"></i>
          <span>如何开启公众账号开发模式？</span>
        </section>
        <section class="padding-l-20px">登录到微信国内公众平台账号，进入菜单栏 <span class="primary-color">"开发者中心" </span> > <span class="primary-color"> "成为开发者" </span>,根据提示讲URL和Token复制到相应输入框中，点击 <span class="primary-color">"提价"</span>后，点击 <span class="primary-color">"启动"</span>启动开发者模式
        </section>
      </el-col>
    </el-form-item>
    <section class="title f-s-16 c555 box-sizing margin-b-30px">
      高级设置
    </section>
    <el-form-item label="App ID :">
      <el-col :span="20">
        <el-input placeholder="请输入App ID"></el-input>
      </el-col>
    </el-form-item>
    <el-form-item label="App Secret :">
      <el-col :span="20">
        <el-input placeholder="请输入App Secret"></el-input>
        <section class="c999 f-s-11">请填写您在微信公众号平台申请的key和Secret</section>
      </el-col>
    </el-form-item>
    <el-form-item label="" class="margin-b-40">
      <el-col :span="20" class="tip f-s-11 c999 box-sizing">
        <section>
          <i class="el-icon-question f-s-16"></i>
          <span>如何获得AppID和Secret？</span>
        </section>
        <section class="padding-l-20px">1.登陆到微信公众平台账号<span class="margin-l-40">2.进入菜单栏开发者中心
</span><span class="margin-l-40">3.勾选协议，点击"成为开发者"，找到AppID和AppSercet填入即可</span>
        </section>
        <section class="padding-l-20px">注：目前只有服务号和认证订阅号才有AppID和AppSercet</section>
        <section class="margin-top-25px">
          <i class="el-icon-warning f-s-16"></i>
          <span>手动接入最多只可接入一个微信公众号哦</span>
        </section>
      </el-col>
    </el-form-item>
    <section class="title f-s-16 c555 box-sizing margin-b-30px">
      功能开关
    </section>
    <el-form-item label="">
      <el-checkbox disabled>知识分类功能 </el-checkbox>
      <a href="javascript:;" class="primary-color padding-l-20px">什么是知识分类</a>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">保存</el-button>

    </el-form-item>
  </el-form>
</template>
<script>
  export default {
    data(){
      return{
        title:'基础设置',
        form:{
          url:'dsafdsafdsafdsaf',
          Token:'ssss'
        }
      }
    },
    components:{
    }
  }
</script>
<style lang="scss" scoped>
  $titleBackground: #f9fafc;
  .yoy-main{
    padding:20px 40px 40px 40px;
  }
  .title{
    padding-left:10px;
    width: 100%;
    height:36px;
    line-height: 36px;
    background: $titleBackground;
  }
  .tip{
    /*width:100%;*/
    line-height: 22px;
    padding:13px 10px;
    background: $titleBackground;
  }
  .padding-l-20px{
    padding-left:20px;
  }
  .margin-b-30px{
    margin-bottom: 30px;
  }
  .margin-b-40{
    margin-bottom: 40px;
  }
  .margin-l-40{
    margin-left: 40px;
  }
  .margin-top-25px{
    margin-top:25px;
  }
</style>
