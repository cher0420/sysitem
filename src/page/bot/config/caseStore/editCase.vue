<template>
  <div>

    <div class="container">
      <div>
        <div class="caseTitle">
          案例标题：
        </div>
        <el-input v-model="title" placeholder="请输入标题"></el-input>

      </div>
      <div class="caseTitle">
        案例内容：
      </div>
      <div>
        <script id="ueid" type="text/plain"></script>

        <el-button class="editor-btn" type="primary" @click="getUEContent">保存</el-button>
        <el-button plain size="mini" @click="indexCaseShow">取消</el-button>
        <!--<button @click="getUEContent()">获取内容</button>-->
      </div>
    </div>
  </div>
</template>
<script>
  // import UE from './ue.vue';
  import {mapActions} from 'vuex'

  export default {
    name: "editCase",
    props: ['navIndex'],
    components: {
      UE
      // quillEditor
    },
    // mounted(){
    //   this.title = this.navIndex.title;
    //
    // },
    data() {
      return {
        editor: null,
        title:"",
        // content: '',
        // editorOption: {
        //   placeholder: '请输入案例内容！'
        // },
        uetest:'<p>sss44444444444444ss</p>',

        config: {
          initialFrameWidth: null,
          initialFrameHeight: 350
        }
      }
    },
    mounted() {
      this.title = this.navIndex.title;

      const _this = this;
      this.editor = UE.getEditor("ueid", this.config); // 初始化UE
      this.editor.addListener("ready", function () {
        _this.editor.setContent(_this.defaultMsg); // 确保UE加载完成后，放入内容。
      });
    },
    methods: {
      getUEContent() {    // 获取内容方法
        console.log(this.editor.getContent())
        return this.editor.getContent()
      },

      // onEditorChange({editor, html, text}) {
      //   this.content = html;
      // },
      // submit() {
      //   console.log(this.title)
      //   console.log(this.content);
      //   this.$alert('保存成功', '操作提示', {
      //     confirmButtonText: '确定',
      //     callback: action => {
      //
      //
      //     }
      //   });
      // },
      ...mapActions(
        ["indexCaseShow"]
      ),

    },
    destroyed() {
      this.editor.destroy();
    }
  }
</script>
<style scoped>

  .caseTitle {
    margin: 10px 0;
    font-size: 18px;
    color: #555;
  }

  .editor-btn {
    margin-top: 20px;
  }
</style>
<style>
  .ql-editor {
    height: 400px;
  }
</style>
