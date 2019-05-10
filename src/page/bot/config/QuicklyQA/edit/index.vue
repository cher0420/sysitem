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
          :error="item.error"
        >
          <el-input v-model="item.value" placeholder="请添加问法" @keyup.enter.native="addSimilarity"></el-input>
          <section v-show='dynamicValidateForm.similarity.length>3' class="delete" @click="deleteItem(index)">
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
          <section v-if="errorTips"> {{errorTips}}</section>
          <section v-else></section>

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

        dynamicValidateForm: {
          similarity: [{ value: '',error: ''}, { value: '',error: ''}, { value: '',error: ''}],
          question: ''
        },

      }
    },
    components:{
      NavTitle,
      TitleText
    },
    created(){

    },
    methods: {
      submitForm(formName) {
        const that = this
        this.$refs.form.validate((valid) => {
          if (valid) {
            if(that.filterData()){
              console.log('通过校验')
            }else{
              return false
            }
          } else {
            return false;
          }
        });
      },
      filterData(){
        const that = this
        let status = true
        if(that.dynamicValidateForm.similarity.length >= 3 ){
          let answer = that.dynamicValidateForm.similarity.map(
            (item) => {
              return item.value
            }
          )
          answer = answer.filter(item => item)
          status = answer&&answer.length >= 3
        }else{
          status = false
        }
        let arr = that.dynamicValidateForm.similarity.map(
          (item, index) => {
            return item.value
          }
        )
        arr.map(
          (item,index,content) => {
            let allIndex = that.searchKeys(item, content)

            if(item&&allIndex.length>1 && allIndex.includes(index+'')){
              that.dynamicValidateForm.similarity[index].error = '已有重复项'
            }else{
              that.dynamicValidateForm.similarity[index].error = ''
            }
          }
        )

        let error = that.dynamicValidateForm.similarity.map(
          (item, index) => {
            return item.error
          }
        )
        if(!status){
          this.errorTips = '请至少输入三个问法'
          return false
        }else if(error.includes('已有重复项')){
          return false
        } else {
          this.errorTips = null
          return true
        }
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      searchKeys(needle, haystack) {
        let result = [];
        for (let i in haystack) {
          if (haystack[i] === needle) {
            result.push(i);
          }
        }
        return result;
        },
      deleteItem(index){
        this.dynamicValidateForm.similarity.splice(index,1)
        this.filterData()

      },
      addSimilarity(){
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
