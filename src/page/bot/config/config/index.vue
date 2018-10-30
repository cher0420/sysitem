<template>
  <el-form ref="ruleForm" :model="ruleForm" :rules="rules"  label-width="150px" v-loading="loading" class="yoy-main">
    <el-form-item label="机器人姓名" prop='Bot_Name'>
      <el-col :span="11">
        <el-input v-model="ruleForm.Bot_Name" maxlength="15"></el-input>
      </el-col>
    </el-form-item>
    <el-form-item label="机器人性别" prop='Bot_Gender'>
      <el-col :span="11">
        <el-radio-group  v-model="ruleForm.Bot_Gender">
          <el-radio label="m">男</el-radio>
          <el-radio label="f">女</el-radio>
        </el-radio-group>
      </el-col>
    </el-form-item>
    <el-form-item label="出生日期">
      <el-col :span="11">
        <el-date-picker v-model='ruleForm.Bot_DayOfBirth' :editable="editable" value-format="yyyy-MM-dd" type="date" placeholder="请选择出生日期" style="width: 100%;" @change="getBot_Constellation"></el-date-picker>
      </el-col>
    </el-form-item>
    <el-form-item label="星座">
      <el-col :span="11" class="c555">
        {{ruleForm.Bot_Constellation}}
      </el-col>
    </el-form-item>
    <el-form-item label="血型" prop="Bot_BloodType">
      <el-col :span="11">
        <el-radio-group v-model="ruleForm.Bot_BloodType">
          <el-radio label="A">A型</el-radio>
          <el-radio label="B">B型</el-radio>
          <el-radio label="C">C型</el-radio>
          <el-radio label="D">D型</el-radio>
        </el-radio-group>
      </el-col>
    </el-form-item>
    <el-form-item label="出生地" prop='Bot_Birthplace.province'>
      <el-col :span="5" >
        <el-select placeholder="请选择省份" v-model="ruleForm.Bot_Birthplace.province" @change="selectArea">
          <el-option
            v-for="item in area"
            :key="item.id"
            :label="item.name"
            :value="item.name">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="5">
        <el-select placeholder="请选择城市" v-model="ruleForm.Bot_Birthplace.city">
          <el-option
            v-for="item in city"
            :key="item.id"
            :label="item.name"
            :value="item.name">
          </el-option>
        </el-select>
      </el-col>
    </el-form-item>
    <el-form-item label="身高" prop='Bot_Height'>
      <el-col :span="11">
        <el-input v-model.number="ruleForm.Bot_Height" placeholder="请输入身高"><span slot="suffix" class="suffix">cm</span>
        </el-input>
      </el-col>
    </el-form-item>
    <el-form-item label="体重" prop="Bot_Weight">
      <el-col :span="11">
        <el-input v-model.number="ruleForm.Bot_Weight" placeholder="请输入体重"><span slot="suffix" class="suffix">kg</span>
        </el-input>
      </el-col>
    </el-form-item>
    <el-form-item label="工作单位" prop="Bot_Company">
      <el-col :span="11">
        <el-input v-model="ruleForm.Bot_Company" placeholder="请输入工作单位" maxlength="15">
        </el-input>
      </el-col>
    </el-form-item>
    <el-form-item label="毕业院校" prop="Bot_School">
      <el-col :span="11">
        <el-input v-model="ruleForm.Bot_School" placeholder="请输入毕业院校" maxlength="15">
        </el-input>
      </el-col>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit('ruleForm')" size="medium">{{button}}</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
  import {ADDRESS} from "../../../../constants/address";
  import {request} from "../../../../serive/request";
  import URL from '../../../../host/baseUrl';
  import {BOTINFO} from "../../../../constants/api";
  import {getCookies} from "../../../../utils/cookie";
  import {TOKEN} from "../../../../constants/constants";
  import moment from 'moment'

  export default {
    data() {
      return {
        address:{city:'',street:''},
        loading:false,
        area:ADDRESS,
        city:ADDRESS[0].child,
        button:'保存',
        editable:false,
        rules: {
          Bot_Name:[{required: true, message: '请填写姓名!'}],
          Bot_Gender:[{required: true, message: '请选择性别!'}],
          Bot_BloodType:[{required: true, message: '请选择血型!'}],
          Bot_Height: [
            {required: false, message: '请填写身高!'},
            { type: 'number', message: '身高必须为数字值'}
          ],
          Bot_Weight:[
            {required: false, message: '请填写体重!'},
            { type: 'number', message: '体重必须为数字值'}
          ],
          Bot_Birthplace:{
            province:[{required: true, message: '请选择省份和城市!'}],
          },
          Bot_Company:[{required: false},{max:15,message:'最多15个字符！'}],
          Bot_School:[{required: false},{max:15,message:'最多15个字符！'}],
        },
        ruleForm: {
          Bot_Name: '',
          Bot_Gender: 'm', // m:man,f:female
          Bot_DayOfBirth: '',
          Bot_Constellation:'',
          Bot_BloodType: 'A',
          Bot_Height: 160,
          Bot_Weight:50,
          Bot_Birthplace: {
            province:'',
            city:''
          },
          Bot_Company:'上海灵羚科技有限公司',
          Bot_School:'上海灵羚科技有限公司',
        },

      }
    },
    beforeCreate(){
      const that = this
      const BotConfigId = this.$route.query.recordId
      const body = {
        BotConfigId,
      }
      const token = getCookies(TOKEN)
      const option = {
        headers:{
          'Access-Token':token
        },
        method:"POST",
        body:JSON.stringify(body)
      }
      request(URL.requestHost+BOTINFO,option).then(
        (res) =>{
          const data = res['Data'][0]
          data.Bot_Height = data.Bot_Height-0
          data.Bot_Weight = data.Bot_Weight-0
          const Bot_Birthplace = data.Bot_Birthplace?data.Bot_Birthplace.split('-'):[]
          data.Bot_Birthplace = {
            province:Bot_Birthplace[0],
            city:Bot_Birthplace[1],
          }
          that.ruleForm = data
        }
      )
    },
    methods: {
      submit(formName) {
        const that = this
        this.$confirm('确认保存?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.validate(formName)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消保存'
          });
        });
      },
      validate(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const data  = JSON.parse(JSON.stringify(this.ruleForm))
            data.Bot_Birthplace = `${data.Bot_Birthplace.province}-${data.Bot_Birthplace.city}`
            delete data.Status
            this.submitForm(data)
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      submitForm(v){
        const that = this
        that.loading = true
        const BotConfigId = this.$route.query.recordId
        const body = {
            ...v,
          BotConfigId,
        }
        const token = getCookies(TOKEN)
        const option = {
          headers: {
            'Access-Token': token
          },
          method: "POST",
          body: JSON.stringify(body)
        }
        request(URL.requestHost+'/api/BotProfile/StoreBotProfile',option).then(
          (res) =>{
            that.$message({
              type: 'success',
              message: '保存成功',
              duration: 2000,
              onClose:() => {
                that.loading = false;
              }
            });
          }
        ).catch(
          () =>{
            that.$message({
              type: 'error',
              message: '保存失败',
              duration: 2000,
              onClose:() => {
                that.loading = false;
              }
            });
          }
        )
      },
      getBot_Constellation(v){
        if(!v){
          this.ruleForm.Bot_Constellation ='--'
        }else{
          this.ruleForm.Bot_DayOfBirth = v
          const m = moment(v).format('MM')
          const d = moment(v).format('DD')
          const res = "魔羯水瓶双鱼白羊金牛双子巨蟹狮子处女天秤天蝎射手魔羯".substr(m*2-(d<"102223444433".charAt(m-1)- -19)*2,2);
          this.ruleForm.Bot_Constellation = res+'座'
        }
      },
      selectArea(k){
        const that = this
        that.ruleForm.Bot_Birthplace.city = ''
        that.area.forEach(
          (v,key) =>{
            if(v.name === k){
              that.city = v.child
            }
          }
        )
      }
    },
  }
</script>
<style lang="scss" scoped>
  .suffix{
    display: inline-block;
    width: 50px;
  }
</style>
