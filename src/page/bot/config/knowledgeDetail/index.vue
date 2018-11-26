<template>
  <section class="yoy-main c777">
    <section class="tapList">
      <span class="firTap">选择渠道：</span>
      <span v-for="(data,key,index) in tapList"  class="text-a-c" v-bind:class="{isChecked:key === botCheckIndex}" @click="handleClick(key)" :index="key">
        <i :style="{background: key === botCheckIndex?
        'url(' + require(`../../../../assets/bot/${key}Checked.png`) + ')center center no-repeat':
          'url(' + require(`../../../../assets/bot/${key}.png`) + ')center center no-repeat'
        }" alt="" class="align-middle"></i>
        {{data}}
      </span>
    </section>
    <el-tabs v-model="activeName2" type="card" @tab-click="handleTip" class="yoy-tabs">
      <el-tab-pane label="标准回答" name="second" class="yoy-tab-pane" v-html="str">
      </el-tab-pane>
      <el-tab-pane label="友好回答" name="first" class="yoy-tab-pane">
        <section v-html="str">
        </section>
      </el-tab-pane>
    </el-tabs>
    <section>

    </section>
    <section class="uploadContainer">
      <el-row class="el-upload-list el-upload-list--picture-card" style="float: left;">
        <el-col v-for="(item,index) in uploadList"  class="p-relative picItem">
          <section class="p-absolute opacity f-s-20">
            <span class="dis-i-b">
              <i class="el-icon-zoom-in" @click="preview(item.url)"></i>
              <i class="el-icon-delete" @click="handleDel(item.url,index)"></i>
            </span>
          </section>
          <img :src="item.url" alt="">
        </el-col>
      </el-row>
      <section>
        <section>
          <section v-show="uploadList.length<3" class="el-upload el-upload--picture-card" @click="uploadContainer" style="float: left">
            <i class="el-icon-plus">
            </i>
            <input type="file" class="el-upload__input" ref="yoy-image-upload" accept="image/*" @change="uploadHandle">
          </section>
          <section class="tips">
            (上传照片，支持jpg,jpeg,png,gif,svg格式，最大不超过200k,最多3张)
          </section>
        </section>
        <el-button type="primary" class="save">保存</el-button>
      </section>

      <el-dialog :visible.sync="dialogVisible" class="text-a-c">
        <img width="400" :src="dialogImageUrl" alt="">
      </el-dialog>
    </section>
  </section>
</template>
<script>
import {detail} from "../knowledgeQuiz/constants";
import store from '../../../../store/index'
import {REPLACE} from "../../../../store/mutations";

export default {
    data(){
      return{
        activeName2: 'first',
        botCheckIndex: 'weChat',
        tapList: {weChat:'微信端',web:'网页端',desktop:'桌面',robot:'实体机器人'},
        str:'',
        dialogImageUrl: '',
        dialogVisible: false,
        uploadList:[],
      }
    },
    destroyed(){
        store.dispatch(REPLACE,{navIndexSecond:''})
    },
    created(){
      const botCheckIndex = this.$route.query.botCheckIndex
      const botName = this.$route.query.botName
      const botIndex = this.$route.query.botIndex
      const str = detail[botName][botIndex]
      this.str=str.replace(/\n+/g, "<br/>")
      this.botCheckIndex = botCheckIndex
    },
    methods: {
      handleClick(v) {
        this.botCheckIndex=v
      },
      preview(v){
        this.dialogVisible = true
        this.dialogImageUrl = v
      },
      confirm(v,index) {
        const that = this
        that.$confirm('确认要删除此图片?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.delRequest(v,index)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      delRequest(v,index){
        const arr = this.uploadList
        arr.splice(index,1)
      },
      handleDel(v,index){
        this.confirm(v,index)
      },
      uploadHandle(v){
        const that = this
        const file = v.target.files[0];
          if(!file){
            return;
          }
        // if (file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/gif') {
          //   alert('不是有效的图片文件!');
          //   return;
          // }
          // 读取文件:
          const reader = new FileReader();
          //初始化图像对象
          let obj = {}
        //获取文件名字
        const name = file.name
          reader.onload = function(e) {
            const url = e.target.result;
            //获取文件base64内容
            // const url = str.match(/base64,(\S*)/)[1]
            //图像对象赋值
            obj = {
              name,
              url
            }
            that.uploadList.push(obj)
            that.$refs['yoy-image-upload'].value = ''
          };
          // 以DataURL的形式读取文件:
          reader.readAsDataURL(file);
        // });
      },
      uploadContainer(v){
        const input = this.$refs['yoy-image-upload']
        input.click()
        // 监听change事件:
      },
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../../../style/index";

  .tapList{
    height: 48px;
    line-height: 48px;
    background: #f9fafc;
    padding-left: 12px;
    .firTap{
      width: 88px;
    }
    i{
      display: inline-block;
      height: 28px;
      width: 30px;
      margin-right: 10px;
    }
    span{
      display: inline-block;
      width: 160px;
    }

    .unChecked{
      color: #777;
      background: #f9fafc;
    }
    .text-a-c:hover{
      cursor: pointer;
      color: $primary-color;
    }
    .isChecked{
      color: $primary-color;
      background: #f0f2f7;
    }
  }
  .yoy-tabs{
    margin-top: 20px;
  }
  .yoy-tab-pane{
    height: 200px;
    margin: 20px 0;
    padding: 0 20px;
    overflow-y: scroll;
    box-sizing: border-box;
  }

  .uploadContainer{
    margin-top: 20px;
  }
  .picItem{
    width: 80px;
    height: 80px;
    margin-right: 20px;
    -webkit-border-radius: 6px;
    -moz-border-radius: 6px;
    border-radius: 6px;
    border: 1px solid #c0ccda;
  }
  .opacity{
    width: 100%;
    height: 100%;
    opacity: 0;
    background: rgba(0,0,0,0);
    -webkit-border-radius: 6px;
    -moz-border-radius: 6px;
    border-radius: 6px;
    span{
      width: 100%;
      margin: 0 auto;
      height: 80px;
      line-height: 80px;
      text-align: center;
      color:#fff;
      i{
        display: inline-block;
        width: 28px;
        height: 28px;
        line-height: 28px;
        cursor: pointer;
      }
    }
  }
  .opacity:hover{
    opacity: 1;
    background: rgba(0,0,0,.5);
    transition:all .3s;
  }
  .save{

    float: right;
  }
  .tips{
    float: left;
    height: 80px;
    line-height: 80px;
  }
</style>
