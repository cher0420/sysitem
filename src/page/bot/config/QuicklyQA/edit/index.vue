<template>
  <section id="quicklyQa">
<!--    创建页面-->
    <nav-title :title="title"></nav-title>
    <section>
<!--      步骤页面-->
      <section v-if="step === 1">
        <title-text title="第一步：问题名称">
        </title-text>
        <el-form ref="dynamicValidateForm" :rules='rules' :model="dynamicValidateForm" label-width="40px" style="margin-top: 30px;">
          <el-row>
            <el-col :span="14" style="margin-bottom: 8px;">
              <el-form-item prop="question" :error="errorQuestionMessage">
                <el-input autofocus v-if="routerName === 'create'" v-model="dynamicValidateForm.question" placeholder="例如：2019年年会在哪里举办" @blur="checkQuestion"></el-input>
                <section class="c555" v-else>{{dynamicValidateForm.question}}</section>
              </el-form-item>
            </el-col>
          </el-row>
          <title-text title="添加问法（至少三个，至多十个）"></title-text>
          <el-row style="margin-top: 30px;">
            <el-form-item
              v-for="(item, index) in dynamicValidateForm.similarity"
              :key="index"
              prop="similarity"
              :error="item.error"
            >
              <el-col
                :span="14"
                class="quicklyQA"
              >
                  <el-input autofocus v-model="item.value" placeholder="请输入问法语句" @blur="checkRules(item.value,index)"></el-input>
                  <section v-show='dynamicValidateForm.similarity.length>3' class="delete" @click="deleteItem(index)">
                    <i class="el-icon-close"></i>
                    <span>删除</span>
                  </section>
              </el-col>
            </el-form-item>

            <el-col :span="14" v-show="dynamicValidateForm.similarity.length<10">
              <el-button type="text" style="width: 120px" @click="addSimilarity"><i class="el-icon-circle-plus"></i><span>添加</span></el-button>
            </el-col>
          </el-row>
          <section style="margin-top: 50px;">
            <el-form-item>
              <el-button type="primary" @click="submitForm('dynamicValidateForm')">下一步</el-button>
              <span class="error">{{errorTips}}</span>
            </el-form-item>
          </section>
        </el-form>
      </section>
      <section v-else>
        <title-text title="第一步：问题名称"></title-text>
        <el-form ref="form" :rules='rules' label-width="0px">
          <el-row class="normal-text-box">
            <el-col :span="dynamicValidateForm.question.length>20?'22':'14'" class="normal-text">
              {{dynamicValidateForm.question}}
            </el-col>
          </el-row>
          <title-text title="添加问法（至少三个，至多十个）"></title-text>
          <el-row :class="!longList?dynamicValidateForm.similarity.length<=3?['normal-text-box','height-190']:['normal-text-box','height-211']:['normal-text-box']">
            <section v-if="routerName==='create'">
              <el-col
                :span="item.value.length>20?'22':'14'"
                v-for="(item, index) in dynamicValidateForm.similarity"
                :key="index"
                class="normal-text"
                :style="{display: !longList&&index>2?'none':'block'}"
              >
                {{item.value}}
              </el-col>
              <el-col v-if='dynamicValidateForm.similarity.length>3' :span="14" class="show-more">
              <span @click="showMore">
                 {{longList?'收起':'展开'}}
              </span>
              </el-col>
            </section>
            <section v-else>
              <el-row>
                <el-form-item
                  v-for="(item, index) in dynamicValidateForm.similarity"
                  :key="index"
                  prop="similarity"
                  :error="item.error"
                >
                  <el-col
                    :span="14"
                    class="quicklyQA"
                  >
                    <el-input autofocus v-model="item.value" placeholder="请输入问法语句" @blur="checkRules(item.value,index)"></el-input>
                    <section v-show='dynamicValidateForm.similarity.length>3' class="delete" @click="deleteItem(index)">
                      <i class="el-icon-close"></i>
                      <span>删除</span>
                    </section>
                  </el-col>
                </el-form-item>

                <el-col :span="14" v-show="dynamicValidateForm.similarity.length<10">
                  <el-button type="text" style="width: 120px;margin-left: -35px" @click="addSimilarity"><i class="el-icon-circle-plus"></i><span>添加</span></el-button>
                </el-col>
              </el-row>
              <el-col v-if="dynamicValidateForm.similarity.length>3 && routerName ==='create'" :span="14" class="show-more">
              <span @click="showMore">
                 {{longList?'收起':'展开'}}
              </span>
              </el-col>
            </section>

          </el-row>
        </el-form>
          <title-text title="第二步：设置答案"></title-text>
<!--        <el-row>-->
<!--          <el-col :span="14" class="p-relative">-->
          <section class="p-relative" style="width: 60%;">
              <textarea
                class="c555 answer-box"
                rows="8"
                maxlength="500"
                placeholder="请输入自定义回答，最多500个字符"
                v-model="textAnswer.KnowledgeBase"
                @input="getTextTotal"
            >
            </textarea>
              <span class='computedTotal'>{{textTotal}}/500字</span>
  <!--          </el-col>-->
  <!--        </el-row>-->
          </section>
        <el-row
          v-show="uploadList.length>0"
          class="el-upload-list el-upload-list--picture-card"
          style="margin-left: 40px;float: left;"
        >
          <el-col v-for="(item,index) in uploadList" class="p-relative picItem text-a-c" :key="index">
            <img :src="item.KnowledgeBase" alt="图片" class="align-middle-img">
            <section class="p-absolute opacity f-s-20" >
              <span class="dis-i-b">
                <i class="el-icon-zoom-in" @click="preview(item.KnowledgeBase)"></i>
                <i class="el-icon-delete"  @click="del(item,index,'uploadList')"></i>
              </span>
            </section>
          </el-col>
        </el-row>
        <section style="height: 80px;margin-left: 40px;">
          <section
            v-if="uploadList.length<3"
            class="el-upload el-upload--picture-card p-relative"
            @click="uploadContainer"
            style="float: left;margin-right: 20px"
          >
            <i
              class="el-icon-plus"
              style="position: absolute;left: 50%;
          top: 50%;
          margin-top: -14px;
          margin-left: -14px;"
            ></i>
            <input
              type="file"
              accept="image/*"
              class="el-upload__input"
              style="display: none"
              ref="yoy-image-upload"
              @change="uploadHandle"
            >
          </section>
          <section class="tips">（至多上传3张，每张不超过200K，支持jpg、jpeg、png、gif格式）</section>
        </section>
        <el-dialog :visible.sync="dialogVisible" class="text-a-c">
          <img width="400" :src="dialogImageUrl" alt>
        </el-dialog>
        <section style="margin-top: 50px;">
          <el-button @click="lastStep" v-if="routerName==='create'">上一步</el-button>
          <el-button :disabled='uploadList.length <= 0 && !trimStr(textAnswer.KnowledgeBase)' type="primary" @click="save('dynamicValidateForm')">完成</el-button>
          <span class="error">{{errorTips}}</span>
        </section>
      </section>
      </section>
  </section>
</template>
<script>
  import NavTitle from '../../../../../components/NavTitle';
  import TitleText from '../../../../../components/Title';
  import store from '../../../../../store';
  import {request} from "../../../../../serive/request";
  import {getCookies} from "../../../../../utils/cookie";
  import {TOKEN} from "../../../../../constants/constants";
  import {upload_delete_img} from "../../../../../serive/request";
  import {Loading} from 'element-ui'

  export default {
    data(){
      var validatePass = (rule, value, callback) => {
          value = this.trimStr(value)
          if (value === '') {
            callback(new Error('问题名称不能为空'));
          } else {
            if(this.errorQuestionMessage){
              callback(new Error(this.errorQuestionMessage));
            }else{
              callback();
            }
          }
      }
      return {

        dynamicValidateForm: {
          similarity: [{ value: '',error: ''}, { value: '',error: ''},{ value: '',error: ''}],
          question: ''
        },
        rules:{
          question: [
            { required: true, message: '问题名称不能为空', trigger: 'blur' },
            { max: 50, message: '至多输入50个字符', trigger: 'blur' },
            { validator: validatePass, trigger: 'blur' }
          ],
          similarity:[
            // { validator: validatePassSimilarityRules, trigger: 'blur' },
            // { max: 50, message: '至多输入50个字符', trigger: 'blur' },
            // { required: false, message: '问题名称不能为空', trigger: 'blur' }
          ]
        },
        errorTips:'',
        step:2,
        title: '创建新问答',
        routerName: 'create',
        uploadList:[],
        dialogVisible:false,
        textTotal:0,
        textAnswer:{Id:'',KnowledgeBase:''},
        dialogImageUrl:'',
        DeleteIds:[],
        deleteImgArr:[],
        longList: false,
        loadingInstance:null,
        errorQuestionMessage:'',
        ImageDelete:[]
      }
    },
    components:{
      NavTitle,
      TitleText
    },
    created(){
      this.routerName = this.$route.name
      // this.routerName = 'edit'
      this.title = this.routerName === 'create'? '创建新问答':'编辑'
      this.step = this.routerName === 'create'? 1:2
      if(this.step === 2){
        this.getDetails()
      }
    },
    directives:{
      focus: {
        inserted: function (el) {
          el.querySelector('input').focus()
        }
      }
    },
    methods: {
      checkRules(value,index){
        let arr = JSON.parse(JSON.stringify(this.dynamicValidateForm.similarity))

        if(value.length>50){
          arr[index].error = '至多输入50个字符'
        }else{
          arr[index].error = ''
        }
        this.dynamicValidateForm.similarity = arr
      },
      getDetails(){
        const that = this
        const TenantId = store.state.app.userInfo.TenantId
        const BotRecordId = this.$route.query.recordId?this.$route.query.recordId:JSON.parse(sessionStorage.getItem('recordId'))
        const QuestionId = this.$route.query.questionId
        const token = getCookies(TOKEN)
        const params = {
          headers:{
            'Access-Token': token
          },
          method: 'POST',
          body: JSON.stringify({
            TenantId,
            BotRecordId,
            QuestionId
          })
        }
        request('/api/admin/portal/QQA/QueryDetails',params).then(
          (res) => {
            let similarityFamily =
              res.Data.SimilarQuestions.length>0&&
              res.Data.SimilarQuestions.map(
              (item) => {
                if(item){
                  return {
                    value:item,
                    error:''
                  }
                }
              }
            )

            this.dynamicValidateForm.question = res.Data.QuestionName
            this.dynamicValidateForm.similarity = similarityFamily
            this.textAnswer = res.Data.Text

            this.uploadList = res.Data.Image
            this.textTotal = this.textAnswer.KnowledgeBase.length
          }
        )

      },

      /**
       * 问题名称查重
       * @param value
       */
      checkQuestion(value){
        this.errorQuestionMessage = ''
        if(this.dynamicValidateForm.question.length <= 50){
          value = this.trimStr(this.dynamicValidateForm.question)
          if(value){
            const QuestionName = value
            const TenantId = store.state.app.userInfo.TenantId
            const BotRecordId = this.$route.query.recordId?this.$route.query.recordId:JSON.parse(sessionStorage.getItem('recordId'))
            const token = getCookies(TOKEN)
            const params = {
              headers:{
                'Access-Token': token
              },
              method: 'POST',
              body: JSON.stringify({
                QuestionName,
                TenantId,
                BotRecordId
              })
            }
            request('/api/admin/portal/QQA/IsQuesExist',params).then((res) => {
              if(res.Data){
                this.errorQuestionMessage = '当前问题已存在'+Math.random()*100
                this.errorQuestionMessage = this.errorQuestionMessage.substr(0,7)
              } else {
                this.errorQuestionMessage = ''
              }
            }).catch(() => {

            })
          }
        }
      },

      /**
       * 保存答案.根据路由判断
       */
      save(){
        const that = this
        debugger;
        const element = document.getElementById('quicklyQa')
        this.loadingInstance = Loading.service({target: element});
        this.textAnswer.KnowledgeBase = this.trimStr(this.textAnswer.KnowledgeBase)
        if(this.routerName === 'create'){
              this.upload_img('/api/admin/portal/QQA/Add')
            }else{
          let lengthStatus = true
          that.dynamicValidateForm.similarity.forEach(
            (item) => {
              if(item.value.length > 50){
                lengthStatus = false
              }
            }
          )
          if(lengthStatus){
            if(that.filterData()){
              that.dynamicValidateForm.similarity = that.dynamicValidateForm.similarity.filter(
                (item) => {
                  if(item.value){
                    return item
                  }
                }
              )
              this.upload_img('/api/admin/portal/QQA/Update')
            }
          }
          this.loadingInstance.close()
        }
      },
      upload_img(url) {
        const that = this
        const id = JSON.parse(sessionStorage.getItem('recordId'))
        const Id = this.$route.query.recordId?this.$route.query.recordId:id
        const Files = [];
        let imageArr = this.uploadList.slice(0)
        imageArr.forEach((v, key, arr) => {
          if (v.KnowledgeBase.match(/base64,(\S*)/)) {
            const Context = v.KnowledgeBase.match(/base64,(\S*)/)[1];
            const obj = {
              Content:Context,
              Extension: v.type
            };
            Files.push(obj);
          }
        });

        const body = {
          Command: "upload",
          Id,
          Files
        };
        const params = {
          body: JSON.stringify(body)
        };
        upload_delete_img(params).then(res => {
          let arr = [];
          if(that.routerName === 'create'){

            arr = res.FilesName

          } else {

            res.FilesName.forEach((v, k) => {
              const obj = {
                KnowledgeBase: v,
                Id: ""
              };
              arr.push(obj);
            });

          }

          this.update_Detail(url,arr);
        });
      },
      update_Detail(url,arr){
        const TenantId = store.state.app.userInfo.TenantId
        const BotRecordId = this.$route.query.recordId?this.$route.query.recordId:JSON.parse(sessionStorage.getItem('recordId'))
        const token = getCookies(TOKEN)
        const SimilarQuestions = this.dynamicValidateForm.similarity.map(
          (item) => {
            return item.value
          }
        )
        let params = {}
        if(this.routerName === 'create'){
          params = {
            headers:{
              'Access-Token': token
            },
            method:'POST',
            body:JSON.stringify({
              TenantId,
              BotRecordId,
              QuestionName: this.dynamicValidateForm.question,
              SimilarQuestions,
              Answer:{
                Text: this.textAnswer.KnowledgeBase,
                Images: arr
              }
            })
          }
        }else{
          params = {
            headers:{
              'Access-Token': token
            },
            method:'POST',
            body:JSON.stringify({
              TenantId,
              BotRecordId,
              QuestionId: this.$route.query.questionId,
              SimilarQuestions,
              ImageDelete:this.ImageDelete,
              Text: this.textAnswer,
              Image: arr
            })
          }

        }
        request(url,params).then(
          (res) => {
            this.$message({
              type:'success',
              message: `${this.routerName === 'create'?'创建':'更新'}成功`,
              duration: 2000
            })
            setTimeout(
              () => {
                const query = this.$route.query
                const url = { path: "/bot/config/quicklyQA", query:{...query}};
                this.$router.push(url)
              },800
            )
            this.loadingInstance.close()
          }
        )
      },
      showMore(){
        this.longList = !this.longList
      },
      getTextTotal() {
        this.textTotal =  this.textAnswer.KnowledgeBase.length
      },
      lastStep(){
        this.step = 1
      },
      uploadHandle(v) {
        const that = this;
        const file = v.target.files[0];
        const type = file.type;
        if (!/image\/\w+/.test(type) || file.type.indexOf("svg") > -1) {
          this.$message({
            type: "error",
            message: "只能上传jpg, jpeg, png, gif格式类型的图片"
          });
          return;
        }
        if (!file || file.size > 200 * 1024) {
          this.$message({
            type: "error",
            message: "请上传文件不大于200KB的图片！"
          });
          return;
        }
        // 读取文件:
        const reader = new FileReader();
        //初始化图像对象
        let obj = {};
        //获取文件名字
        const name = file.name;
        reader.onload = function(e) {
          const KnowledgeBase = e.target.result;

          //图像对象赋值
          // debugger;
          const type = name.substring(name.lastIndexOf(".")).replace(".", "");
          obj = {
            name,
            KnowledgeBase,
            type
          };
          that.uploadList.push(obj)
          that.$refs["yoy-image-upload"].value = "";
        };
        // 以DataURL的形式读取文件:
        reader.readAsDataURL(file);
        // });

      },
      uploadContainer(v) {
        const input = this.$refs["yoy-image-upload"];
        input.click();
        // 监听change事件:
      },
      del(v, index,arr) {
        this[arr].splice(index, 1);
        if (v.Id) {
          this.ImageDelete.push(v.Id);
        }
        // this.save();
      },
      preview(v) {
        this.dialogVisible = true;
        this.dialogImageUrl = v;
      },
      trimStr(value){
        value = value.replace(/(^\s*)|(\s*$)/g, "")
        return value
      },
      submitForm(formName) {
        const that = this
        let lengthStatus = true
        this.$refs[formName].validate((valid) => {
          if (valid && !this.errorQuestionMessage) {
            that.dynamicValidateForm.similarity.forEach(
              (item) => {
                if(item.value.length > 50){
                  lengthStatus = false
                }
              }
            )
            if(lengthStatus){
              if(that.filterData()){
                that.step = 2
                that.dynamicValidateForm.similarity = that.dynamicValidateForm.similarity.filter(
                  (item) => {
                    if(item.value){
                      return item
                    }
                  }
                )
              }else{
                return false
              }
            }else{
              that.step = 1
            }
          } else {
            return false
          }
        });
      },
      filterData(){
        const that = this
        let status = true
        //去除空格
        that.dynamicValidateForm.question = that.trimStr(that.dynamicValidateForm.question)

        that.dynamicValidateForm.similarity.map(
          (item) => {
            item.value = that.trimStr(item.value)
          }
        )
        //去除空格

        //判断重复

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

        arr.forEach(
          (item,index,content) => {

            let allIndex = that.searchKeys(item, content)

            if(item&&allIndex.length>1 && allIndex.includes(index+'')){

              // that.dynamicValidateForm.similarity[index].error = '输入问法重复'

              const similarityArr = JSON.parse(JSON.stringify(that.dynamicValidateForm.similarity))
              similarityArr[index].error = '输入问法重复'
              that.dynamicValidateForm.similarity = similarityArr
            }else{
              const similarityArr = JSON.parse(JSON.stringify(that.dynamicValidateForm.similarity))
              similarityArr[index].error = ''
              that.dynamicValidateForm.similarity = similarityArr

            }
          }
        )

        let error = that.dynamicValidateForm.similarity.map(
          (item, index) => {
            return item.error
          }
        )

        //判断重复

        if(status){
          that.errorTips = ''
        }else{
          that.errorTips = '请至少输入三个问法'
        }

        if(!status || error.includes('输入问法重复') || !that.dynamicValidateForm.question){
          return false
        }else{
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
      addSimilarity(index, value){
        let arr = this.dynamicValidateForm.similarity.slice(0)
        arr.push({
            value: '',
            error:''
          }
        )
        this.dynamicValidateForm.similarity = arr
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import '../../../../../style/var/color';
  @import '../../../../../style/var/font-size';
  .height-190{
    height: 190px;
  }
  .height-211{
    height: 211px;
  }
  .add{
    cursor: pointer;
    color: $primary-color;
  }
  .error{
    color: $danger;
  }

  .delete{
    width: 66px;
    position: absolute;
    right: 1px;
    top: 50%;
    height: 30px;
    line-height: 30px;
    background: #fff;
    -webkit-transform: translate(0, -50%);
    transform: translate(0, -50%);
    color: #f04b4b;
    display: none;
    cursor: pointer;
  }
  .delete:hover{
    text-decoration: underline;
  }
  .normal-text:hover, .quicklyQA:hover{
    .delete{
      display: inline-block;
    }
  }
  .answer-box {
    border: 1px solid $border-color;
    outline: none;
    width: 100%;
    padding: 20px;
    resize: none;
    transition: border .5s;
    margin-top: 30px;
    margin-left: 40px;
    margin-bottom: 15px;
  }
  .answer-box:hover {
    border: 1px solid $primary-color;
  }
  .answer-box:focus {
    border: 1px solid $primary-color;
  }

  .answer-box::-webkit-input-placeholder {
    color: #999;
  }
  .computedTotal{
    display: inline-block;
    text-align: right;
    position: absolute;
    height: 14px;
    line-height: 14px;
    right: -52px;
    bottom: 35px;
    color: $f-pri-c;
  }
  .deleteBtn{display:none;}

  .picItem {
    width: 80px;
    height: 80px;
    margin-right: 20px;
    -webkit-border-radius: 6px;
    -moz-border-radius: 6px;
    border-radius: 6px;
    border: 1px solid #c0ccda;
    overflow: hidden;
  }
  .opacity {
    width: 100%;
    height: 100%;
    opacity: 0;
    background: rgba(0, 0, 0, 0);
    -webkit-border-radius: 6px;
    -moz-border-radius: 6px;
    border-radius: 6px;
    span {
      width: 100%;
      margin: 0 auto;
      height: 80px;
      line-height: 80px;
      text-align: center;
      color: #fff;
      i {
        display: inline-block;
        width: 28px;
        height: 28px;
        line-height: 28px;
        cursor: pointer;
      }
    }
  }
  .opacity:hover {
    opacity: 1;
    background: rgba(0, 0, 0, 0.5);
    transition: all 0.3s;
  }
  .tips {
    color:#999;
    float: left;
    height: 80px;
    line-height: 80px;
  }
  .align-middle-img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: auto;
    max-width: 100%;
    height: auto;
    max-height: 100%;
  }
  .normal-text-box{
    height: 100%;
    /*transition:2s cubic-bezier(.25,.1,.3,1.5);*/
    padding: 30px 0 30px 40px;
  }
  .normal-text{
    position:relative;
    color: $f-pri-c;
    font-size: 14px;
    height: 40px;
    line-height: 40px;
  }
  .show-more{
    color: $primary-color;
    font-size: 14px;
    margin-bottom: 10px;
    span{
      display: inline-block;
      width: 60px;
      /*height: 28px;*/
      /*line-height: 28px;*/
      cursor: pointer;
    }
  }

</style>

<style lang="scss">
  @import '../../../../../style/var/color';
  .quicklyQA{
    position:relative;
    .question-item:hover{
      .el-input__inner{
        border-color: $primary-color;
      }
    }
  }
</style>
