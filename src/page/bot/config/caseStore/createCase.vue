<template>
  <div>

    <div class="container">
      <div>
        <div class="caseTitle">
          创建案例标题：
        </div>
        <el-input v-model="title" placeholder="请输入标题"></el-input>

      </div>
      <div class="caseTitle">
        创建案例内容：
      </div>
      <quill-editor ref="myTextEditor" v-model="content" :options="editorOption"></quill-editor>
      <el-button class="editor-btn" type="primary" @click="submit">保存</el-button>
      <el-button plain size="mini" @click="indexCaseShow">取消</el-button>
    </div>
  </div>
</template>
<script>

  import {mapActions} from 'vuex'

  export default {
    name: "editCase",
    props: ['navIndex'],
    components: {
      // quillEditor
    },
    mounted(){


    },
    data() {
      return {
        title:"",
        content: '',
        editorOption: {
          placeholder: '请输入案例内容！'
        }
      }
    },
    methods: {
      onEditorChange({editor, html, text}) {
        this.content = html;
      },
      submit() {
        console.log(this.title)
        console.log(this.content);
        this.$alert('是否保存？', '操作提示', {
          confirmButtonText: '确定',
          callback: action => {


          }
        });
      },
      ...mapActions(
        ["indexCaseShow"]
      ),

    }
  }
</script>
<style scoped>
  .editor-btn {
    margin-top: 20px;
  }
  .caseTitle {
    margin: 10px 0;
    font-size: 18px;
    color: #555;
  }
</style>
<style>
  .ql-editor {
    height: 400px;
  }
</style>
