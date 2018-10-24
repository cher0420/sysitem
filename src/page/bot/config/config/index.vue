<template>
  <el-form ref="form" :model="form" label-width="150px" v-loading="loading">
    <el-form-item label="机器人姓名">
      <el-col :span="11">
        <el-input v-model="form.name"></el-input>
      </el-col>
    </el-form-item>
    <el-form-item label="机器人性别">
      <el-col :span="11">
        <el-radio-group  v-model="form.gender">
          <el-radio label="man">男</el-radio>
          <el-radio label="woman">女</el-radio>
        </el-radio-group>
      </el-col>
    </el-form-item>
    <el-form-item label="出生日期" >
      <el-col :span="11">
        <el-date-picker type="date" placeholder="请选择出生日期" v-model="form.birth" style="width: 100%;"></el-date-picker>
      </el-col>
    </el-form-item>
    <el-form-item label="星座">
      <el-col :span="11">
        <el-input v-model="form.constellation" :disabled="true"></el-input>
      </el-col>
    </el-form-item>
    <el-form-item label="血型">
      <el-col :span="11">
        <el-radio-group v-model="form.blood">
          <el-radio label="A">A型</el-radio>
          <el-radio label="B">B型</el-radio>
          <el-radio label="C">C型</el-radio>
          <el-radio label="D">D型</el-radio>
        </el-radio-group>
      </el-col>
    </el-form-item>
    <el-form-item label="出生地">
      <el-col :span="5" >
        <el-select placeholder="请选择" v-model="form.address.city">
          <el-option
            v-for="item in area"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="5" offset="1">
        <el-select placeholder="请选择" v-model="form.address.street">
          <el-option
            v-for="item in area.city"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-col>
    </el-form-item>
    <el-form-item label="身高" >
      <el-col :span="11">
        <el-input v-model="form.stature" placeholder="请输入身高">
        </el-input>
      </el-col>
    </el-form-item>
    <el-form-item label="体重" >
      <el-col :span="11">
        <el-input v-model="form.weight" placeholder="请输入体重">
        </el-input>
      </el-col>
    </el-form-item>
    <el-form-item label="工作单位">
      <el-col :span="11">
        <el-input v-model="form.company" placeholder="请输入工作单位">
        </el-input>
      </el-col>
    </el-form-item>
    <el-form-item label="毕业院校">
      <el-col :span="11">
        <el-input v-model="form.school" placeholder="请输入毕业院校">
        </el-input>
      </el-col>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit" size="medium">{{button}}</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
  export default {
    data() {
      return {
        form: {
          name: '',
          gender: 'woman',
          birth: '',
          constellation:'',
          blood: '',
          stature: 160,
          weight:50,
          address: {
            city:[],
            street:[]
          },
          company:'',
          school:''
        },
        loading:false,
        area:[],
        button:'保存'
      }
    },
    methods: {
      onSubmit() {
        console.log('submit!');
      }
    }
  }
</script>
