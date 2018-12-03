<template>
  <div class="yoy-main">
    <div v-if="false">
      <div class="addQuestion">
        第一步:添加问题
      </div>
      <div v-if="questionDis">
        <div class="addContent">
          <el-input v-model="question" placeholder="例如:2018年年会举办地点"></el-input>
        </div>
        <div class="questionTit">
          请用最简洁的方式描述你的问题
        </div>
        <div class="nextStep">
          <el-button type="primary" size="mini" @click="questionNext">下一步</el-button>
        </div>
      </div>
      <div class="addContent addContentDis" v-else>
        {{question}}
      </div>

      <div v-if="!questionDis">
        <div class="addQuestion">
          第二步: 确认关键词 ( 可选择2-4个 )
        </div>
        <div v-if="keywordsDis">
          <div class="keywords">
            <el-checkbox-group v-model="keywords" :min="0"
                               :max="4">
              <div class="checkboxContent">
                <el-checkbox label="美食/餐厅线上活动1" name="keywords"></el-checkbox>
              </div>
              <div class="checkboxContent">
                <el-checkbox label="美食/餐厅线上活动2" name="keywords"></el-checkbox>
              </div>
              <div class="checkboxContent">
                <el-checkbox label="美食/餐厅线上活动3" name="keywords"></el-checkbox>
              </div>
              <div class="checkboxContent">
                <el-checkbox label="美食/餐厅线上活动4" name="keywords"></el-checkbox>
              </div>
              <div class="checkboxContent">
                <el-checkbox label="美食/餐厅线上活动5" name="keywords"></el-checkbox>
              </div>
              <div class="checkboxContent">
                <el-checkbox label="美食/餐厅线上活动6" name="keywords"></el-checkbox>
              </div>
            </el-checkbox-group>
            <!--{{keywords}}-->
          </div>
          <div class="nextStep">
            <el-button type="primary" plain size="mini" @click="questionLast">上一步</el-button>
            <el-button type="primary" size="mini" @click="keywordsNext(keywords.length)" :disabled="checkboxDisabled">
              下一步
            </el-button>
          </div>
        </div>
        <div class="addContent addContentDis" v-else>
          关键词: {{keywordsNew}}
        </div>
        <div v-if="!keywordsDis">
          <div class="addQuestion">
            第三步: 设置答案
          </div>
          <div class="CreateNewQAtextareaParent">
            <el-input
              type="textarea"
              placeholder="请输入自定义回答,最多500个字符"
              v-model="textarea" class="CreateNewQAtextarea">
            </el-input>
            <span class="fontCount">{{textarea.length}}/500字</span>
          </div>
          <div class="nextStep">
            <el-button type="primary" plain size="mini" @click="keywordsLast">上一步</el-button>
            <el-button type="primary" size="mini" @click="updateQA()">完成</el-button>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <updateQA></updateQA>
    </div>
  </div>
</template>
<script>

  import updateQA from "./updateQA";
  import {mapGetters} from 'vuex';
  import {mapActions} from 'vuex';

  export default {
    name: "Allen-CreateNewQA",
    data() {
      return {
        question: "问个问题",
        keywords: [],
        textarea: "",
        timer: "",
        checkboxDisabled: true

      }
    },
    computed: {
      ...mapGetters([
        'questionDis',  // 问题可修改展示
        'keywordsDis',  // 关键词可修改展示
      ]),
      keywordsNew() {
        return this.keywords.join(","); //  关键词拼接展示
      },
    },
    components: {
      updateQA
    },

    created() {
      this.checkSize()

    },
    watch: {
      keywords(curVal, oldVal) {
        if (1 < curVal.length &&curVal.length <5) {
          this.checkboxDisabled = false;
          return false;
        }
        this.checkboxDisabled = true;

      },
    },

    methods: {
      ...mapActions(
        ["questionNext", "questionLast", "keywordsNext", "keywordsLast"]
      ),
      checkSize() {
        let that = this;
        this.timer = setInterval(function () {
          if (that.textarea.length > 500) {
            that.textarea = that.textarea.toString().substr(0, 500);
          }
        }, 200)
      },
      updateQA() {
        this.$router.push({
          path: '/bot/config/updateQA',
          params: {
            id: "uprateQA"
          },
        })

      },

    },
    destroyed() {
      clearInterval(this.timer);

    }

  }
</script>
<style lang="scss" scoped>
  @import '../../../../style/index';

  .addQuestion {
    color: #555;
    font-size: 16px;
    font-family: "Microsoft YaHei";
  }

  .addContent {
    padding-top: 30px;
    padding-left: 40px;
    /*padding-right: 40px;*/
    width: 997px;
    color: #999;
    font-size: 12px;
  }

  .addContentDis {
    padding-bottom: 40px;
    font-size: 12px;
  }

  .questionTit {
    text-align: right;
    padding-top: 6px;
    color: #999;
    font-size: 12px;
    font-family: "Microsoft YaHei";
    padding-right: 30px;
  }

  .nextStep {
    text-align: right;
    margin-top: 33px;
    margin-right: 11px;
  }

  .nextStep button {
    width: 80px;
    text-align: center;
    height: 32px;
    line-height: 32px;
    padding: 0;
  }

  .keywords {
    padding: 0 40px;
  }

  .checkboxContent {
    display: inline-block;
    width: 185px;
    /*border: 1px solid red;*/
    padding-top: 30px;
  }

  .CreateNewQAtextareaParent {
    position: relative;
    padding-top: 30px;
    padding-bottom: 20px;
  }

  .fontCount {
    position: absolute;
    right: 20px;
    bottom: 30px;
    color: #999;
  }
</style>
<style>
  .CreateNewQAtextarea textarea {
    width: 1000px;
    height: 300px !important;
  }

</style>

