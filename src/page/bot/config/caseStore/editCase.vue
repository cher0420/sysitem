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
      　<section>

      　　　　<UE :defaultMsg='uetest' :config=config ref="ue"></UE>

      　　</section>


    </div>
  </div>
</template>
<script>
  import UE from './ue.vue';
  import {mapActions} from 'vuex'

  export default {
    name: "editCase",
    props: ['navIndex'],
    components: {
      UE
      // quillEditor
    },
    mounted(){
      this.title = this.navIndex.title;

    },
    data() {
      return {
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
    methods: {
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

    }
  }
</script>
<style scoped>

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
