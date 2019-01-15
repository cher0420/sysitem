<template>
  <div>
    <div class="containerr">
      <div>
        <div class="caseTitle">
          案例标题：
        </div>
        <div class="caseTitleInput">
          <el-input v-model="title" placeholder="请输入标题"></el-input>
        </div>
      </div>
      <div class="caseTitle">
        案例内容：
      </div>
      <div class="msg">
        <div class="summernote"></div>
      </div>
      <div>
        <el-button class="editor-btn" type="primary" @click="getContent">保存</el-button>
        <el-button plain size="mini" @click="indexCaseShow">取消</el-button>
      </div>
    </div>
  </div>
</template>
<script>

  // import 'bootstrap/dist/css/bootstrap.min.css'
  // import 'bootstrap/dist/js/bootstrap.min.js'
  import {mapActions} from 'vuex'


  export default {
    name: "editCase",
    props: ['navIndex'],
    data() {
      return {
        title: "",
        myVar:"",
      }
    },
    mounted() {
      this.title = this.navIndex.title;
      $(function () {
        $('.summernote').summernote({
          height: 370,
          tabsize: 2,
          lang: 'zh-CN'
        });
      });

      this.myVar = setInterval(function () {
        $(".note-editable").find("*").removeAttr("style");
      }, 100)


    },

    methods: {
      ...mapActions(
        ["indexCaseShow"]
      ),
      getContent() {
        console.log($('.summernote').summernote('code'));
      },
    },
    destroyed() {
      clearInterval(this.myVar);
    }
  }
</script>
<style scoped>

  /*@import "../../../../../static/base.css";*/
  .caseTitle {
    margin: 10px 0;
    font-size: 18px;
    color: #555;
  }

  .editor-btn {
    margin-top: 20px;
  }

  .caseTitleInput {
    width: 960px;
  }

  .msg {
    width: 960px;
    margin: 0;
  }

</style>
