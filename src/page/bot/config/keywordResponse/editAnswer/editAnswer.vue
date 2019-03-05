<template>
 <div v-loading="loadingEdit" >
     <section class="title f-s-16 c555 box-sizing margin-b-30px"> 设置关键词（至多三个）  </section>
    <p class="keyword">文思海辉&成立</p>
     <div class="addContent">
          <section class="title f-s-16 c555 box-sizing margin-b-30px">设置回答
          </section>
     </div>
     <div class="area">
    <textarea class="c555 anwer-area" v-model="keyWords" rows="8" cols="10"  placeholder="请输入自定义友好回答,最多500字"></textarea>
      <span>0/500字</span>
     </div>
      <span>{{ result }}</span>
      <el-button class="nextBtn" @click="nextBtn">保存</el-button>
    </div>

</template>
<script>

  export default {
    name: "Allen-EditQA",
    data() {
      return {
        keyWords:'',
        result: null,

      }
    },
    computed: {},

    created() {
      this.imgList = []
      this.Image = []
      this.ImageNew = []
      // this.getData();
      // this.checkSize();
    },
    mounted() {


    },
    watch: {
      kilometers:function(val) {
          this.kilometers = val;
          this.meters = val * 1000;

      },
      meters : function (val) {
          this.kilometers = val/ 1000;
          this.meters = val;
      },

    },

    methods: {
     nextBtn(V){
        const str ="<>%;/?'_"
        this.result = this.keyWords + " 成功!";
        const index = this.keyWords&&str.indexOf(this.keyWords) > -1
        if(index){
          this.$message({
            type:'error',
            message:"请不要输入特殊字符作为关键词搜索，例如 <，>，%，;，/，?，'，_等",
            duration:2000,
          })
          return
        }
     }
    },
    destroyed() {
      clearInterval(this.timer);
    },

  }

</script>
<style lang="scss" scoped>
  @import '../../../../../style/index';
 .area{position: relative;width:70%;margin-left:40px;}
 .area span{position: absolute;bottom:15px;right: 0;color:#999;}
 .title{ padding-left:10px; width: 100%; height:36px; line-height: 36px; background: #f9fafc;margin-bottom:30px;}
 .anwer-area{height: 300px;outline: none;width: 100%;resize: none;padding: 10px;border:1px solid #e5ebf8;}
 .nextBtn{color:#fff;background:#2a8ce7;border:none;margin-top:40px;display: block;}
 .keyword{font-size:14px;color:#555;margin-bottom: 40px;}
</style>


