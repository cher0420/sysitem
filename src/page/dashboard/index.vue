<template>
  <section>
    <nav-title title="仪表盘">
      <el-select v-model="bot" placeholder="请选择机器人">
        <el-option
          v-for="item in getBotList()"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
    </nav-title>
    <el-row :gutter="20" class="col">
      <el-col :span="8">
        <el-card class="box-card" >
          <div slot="header" class="clearfix">
            <span>卡片名称</span>
            <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
          </div>
          <div v-for="o in 4" :key="o" class="text item">
            {{'列表内容 ' + o }}
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card" >
          <div slot="header" class="clearfix">
            <span>卡片名称</span>
            <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
          </div>
          <div v-for="o in 4" :key="o" class="text item">
            {{'列表内容 ' + o }}
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card" >
          <div slot="header" class="clearfix">
            <span>卡片名称</span>
            <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
          </div>
          <div v-for="o in 4" :key="o" class="text item">
            {{'列表内容 ' + o }}
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="col">
      <el-col :span="8">
        <el-card class="box-card" >
          <div slot="header" class="clearfix">
            <span>卡片名称</span>
            <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
          </div>
          <div v-for="o in 4" :key="o" class="text item">
            {{'列表内容 ' + o }}
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card" >
          <div slot="header" class="clearfix">
            <span>卡片名称</span>
            <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
          </div>
          <div v-for="o in 4" :key="o" class="text item">
            {{'列表内容 ' + o }}
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card" >
          <div slot="header" class="clearfix">
            <span>卡片名称</span>
            <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
          </div>
          <div v-for="o in 4" :key="o" class="text item">
            {{'列表内容 ' + o }}
          </div>
        </el-card>
      </el-col>
    </el-row>
  </section>
</template>
<script>
  import NavTitle from '../../components/NavTitle'
  import WaitPage from '../../components/Wait'
  export default {
    data(){
      return {
        bot: null
      }
    },
    components:{
      NavTitle,
      WaitPage
    },
    methods:{
      getBotList(){
        return [
          {id: 1, name: '工作助理机器人'},
          {id: null, name: '全部机器人'},

        ]
      },
    }
  }
</script>
<style lang="scss" scoped>
  @import '../../style/card';
  .col{
    margin-bottom: 20px;
    &:last-child{
      margin-bottom: 0;
    }
  }
</style>
