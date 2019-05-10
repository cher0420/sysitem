<template>
  <section>
    <nav-title title="创建新问答"></nav-title>
    <title-text title="第一步：问题名称"></title-text>
    <el-form ref="form" :model="dynamicValidateForm" label-width="0px">
      <el-row>
        <el-col :span="14">
          <el-form-item prop="question" :rules="[
      { required: true, message: '请输入问题', trigger: 'blur' },
    ]">
            <el-input v-model="dynamicValidateForm.question" placeholder="例如：2019年年会在哪里举办"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    <title-text title="添加问法（至少三个，至多十个）"></title-text>
      <el-col
        :span="14"
        v-for="(item, index) in dynamicValidateForm.similarity"
        :key="index"
        class="quicklyQA"
      >
        <el-form-item
          class="question-item"
          :prop="'similarity.' + index + '.value'"
          :rules="rules[index]"
        >
          <el-input v-model="item.value" placeholder="请添加问法" @keyup.enter.native="addSimilarity"></el-input>
          <section class="delete" @click="deleteItem(index)">
            <i class="el-icon-close"></i>
            <span>删除</span>
          </section>
        </el-form-item>
      </el-col>
      <el-col :span="14">
        <el-button type="text" style="width: auto" @click="addSimilarity"><i class="el-icon-circle-plus"></i><span>添加</span></el-button>
      </el-col>
      <el-col>
        <el-form-item>
              <el-button type="primary" @click="submitForm('dynamicValidateForm')">下一步</el-button>
            </el-form-item>
      </el-col>
    </el-form>
  </section>
</template>
<script>
  import NavTitle from '../../../../../components/NavTitle';
  import TitleText from '../../../../../components/Title';

  export default {
    data(){

      return {
        validatePass:(rule, value, callback) => {
          let similarity = this.dynamicValidateForm.similarity.map(
            (item) => {
              return item.value
            }
          )
          // function sortAndSet (arr){
            for(let i = 0;i < similarity.length; i ++){
              for(let j = 0; j< similarity.length-i-1; j++){
                if(similarity[j]>similarity[j+1]){
                  [similarity[j],similarity[j+1]] = [similarity[j+1],similarity[j]]
                }
              }
            }
          // similarity.forEach(
          //   (item,index,arr) => {
          //     if(item&&item === arr[index+1]){
          //       return callback(new Error('已有重复项'));
          //     }
          //   }
          // )
          let s = similarity.join(",")+",";
          for(let i=0;i<similarity.length;i++) {
            if(similarity[i]&&s.replace(similarity[i]+",","").indexOf(similarity[i]+",")>-1) {
              return callback(new Error('已有重复项'));
            }
          }
        },
        dynamicValidateForm: {
          similarity: [{ value: ''}, { value: ''}, { value: ''}],
          question: ''
        },
        rules:{
          0:[{ validator: this.validatePass, trigger: 'blur' }],
          1:[{ validator: this.validatePass, trigger: 'blur' }],
          2:[{ validator: this.validatePass, trigger: 'blur' }],
        }
      }
    },
    components:{
      NavTitle,
      TitleText
    },
    created(){
      this.rules = {
        0:[{ validator: this.validatePass, trigger: 'blur' }],
        1:[{ validator: this.validatePass, trigger: 'blur' }],
        2:[{ validator: this.validatePass, trigger: 'blur' }],
      }
    },
    methods:{
      submitForm(formName) {
        this.$refs.form.validate((valid) => {
          if (valid) {

          } else {

            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      deleteItem(index){
        this.dynamicValidateForm.similarity.splice(index,1)
      },
      addSimilarity(){
        const key = Object.keys(this.rules).length

        this.rules[key] = [{ validator: this.validatePass, trigger: 'blur' }]
        console.log(this.rules);
        this.dynamicValidateForm.similarity.push({
          value: '',
        });
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import '../../../../../style/var/color';
  @import '../../../../../style/var/font-size';
  .add{
    cursor: pointer;
    color: $primary-color;
  }
  .question-item{
    position: relative;
  }
  .delete{
    position: absolute;
    right: 20px;
    top: 0;
    color: $danger;
    display: none;
    cursor: pointer;
  }
  .delete:hover{
    text-decoration: underline;
  }
  .question-item:hover{
    .delete{
      display: inline-block;
    }
  }
</style>
<style lang="scss">
  @import '../../../../../style/var/color';
  .quicklyQA{
    .question-item:hover{
      .el-input__inner{
        border-color: $primary-color;
      }
    }
  }
</style>
