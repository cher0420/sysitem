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
      <quill-editor ref="myTextEditor" v-model="content" :options="editorOption"></quill-editor>
      <el-button class="editor-btn" type="primary" @click="submit">保存</el-button>
    </div>
  </div>
</template>
<script>

  import {quillEditor} from 'vue-quill-editor';

  export default {
    name: "editCase",
    components: {
      quillEditor
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
        this.$message.success('提交成功！');
      }
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
