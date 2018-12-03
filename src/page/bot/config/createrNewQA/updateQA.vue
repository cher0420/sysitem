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
        问题 : {{"举办地点"}}
      </div>
      <div class="existingQuestion">
        <div class="existingQues">
          已有关键词
        </div>
      </div>
      <div class="questionDetail">
        关键词 : {{"举办,地点"}}
      </div>
      <div class="existingQuestion">
        <div class="existingQues">
          已设置答案
        </div>
      </div>
      <div class="updateTextarea">
        <el-input
          type="textarea"
          placeholder="请输入自定义回答,最多500个字符"
          v-model="textarea" class="CreateNewQAtextarea">
        </el-input>
        <span class="fontCount">{{textarea.length}}/500字</span>
      </div>
    </div>
    <div class="newQA">
      <div class="existingQuestion">
        <div class="existingQues">
          第一步: 添加问题
        </div>

      </div>
      <div class="questionDetail">
        问题 : {{"举办地点"}}
      </div>
      <div class="existingQuestion">
        <div class="existingQues">
         第二步 : 确认关键词 ( 可选择2-4个 )
        </div>
      </div>
      <div class="questionDetail">
        关键词 : {{"举办,地点"}}
      </div>
      <div class="existingQuestion">
        <div class="existingQues">
          第三步 : 设置答案
        </div>
      </div>
      <div class="updateTextarea updataQuestions">
        <el-input
          type="textarea"
          placeholder="请输入自定义回答,最多500个字符"
          v-model="textarea" class="CreateNewQAtextarea">
        </el-input>
        <span class="fontCount">{{textarea.length}}/500字</span>
      </div>
      <div class="nextStep">
        <el-button type="primary" plain size="mini" @click="alterKeyWords()">修改关键词</el-button>
        <el-button type="primary" size="mini"  >更新回答</el-button>
      </div>
    </div>
  </div>
</template>
<script>


  export default {
    name: "Allen-updateQA",
    data() {
      return {
        textarea:"详细问题",
      }
    },
    computed: {},
    components: {},

    created() {


    },

    methods: {
      alterKeyWords(){
        this.$router.push({
          path: '/bot/config/index',
          params: {
            "alterKeyWords": "alterKeyWords"
          },
        })
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
  .updateTextarea textarea {
    width: 450px;
    height: 300px !important;
    color: #999;
  }
  .updateTextarea {
    padding-top: 30px;
    padding-left: 32px;
    position: relative;
    padding-bottom: 30px;
  }

</style>
