<template>
 <div v-loading="loadingEdit" >
    <div class="keywordTip">

     <section class="title f-s-16 c555 box-sizing margin-b-30px"> 设置关键词（至多三个）  </section>
    <p class="keyword">文思海辉&成立</p>
     <div class="addContent">
          <section class="title f-s-16 c555 box-sizing margin-b-30px">设置回答
          </section>
     </div>
     <div class="area">
    <textarea class="c555 anwer-area"  rows="8" cols="10"  placeholder="请输入自定义友好回答,最多500字" v-model="keyWords"></textarea>
      <span>0/500字</span>
     </div>
     <el-button class="nextBtn" @click="reviseKeyword">修改关键词</el-button><el-button class="nextBtn" @click="reviseKAnswer">更新回答</el-button>
    </div>
    </div>
</template>
<script>

  export default {
    name: "Allen-EditQA",
    data() {
      return {
      }
    },
    computed: {},

    created() {
      this.imgList = []
      this.Image = []
      this.ImageNew = []
    },
    mounted() {

    },
    watch: {},
    methods: {
     reviseKeyword(){
       const url={path:'/bot/config/keywordResponse/addKeyword',}
       this.$router.push(url)
     },
      reviseKAnswer(){
       const url={path:'/bot/config/keywordResponse/editAnswer',}
       this.$router.push(url)
      }
    },
    destroyed() {
      clearInterval(this.timer);
    }

  }
</script>
<style lang="scss" scoped>
  @import '../../../../../style/index';
 .area{position: relative;width:70%;margin-left:40px;}
 .area span{position: absolute;bottom:15px;right: 0;color:#999;}
 .title{ padding-left:10px; width: 100%; height:36px; line-height: 36px; background: #f9fafc;margin-bottom:30px;}
 .anwer-area{height: 300px;outline: none;width: 100%;resize: none;padding: 10px;border:1px solid #e5ebf8;}
 .nextBtn{color:#fff;background:#2a8ce7;border:none;margin-top:40px;display: inline-block;}
 .keyword{font-size:14px;color:#555;margin-bottom: 40px;}
</style>


