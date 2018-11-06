<template>
  <div class="itemDetail">

    <div v-if="caseDetailShow == true">
      <div class="item-title">
        {{navIndex.title}}
      </div>
      <div class="item-assist-title">
        <div>
          创建人：teo  创建时间： {{navIndex.creationDate}}  最后更新： {{navIndex.updateDate }} Jack
        </div>
        <div class="item-assist-title-edit">
          <el-button plain size="mini" @click="editCase">编辑</el-button>
        </div>

      </div>
      <div>
        <p class="item-content">
          详细内容
        </p>
      </div>
      <div class="banner">
        <img src="" alt="">
      </div>
    </div>
    <!-- 编辑页-->
    <div v-if="!caseDetailShow == true">
      <edit-case></edit-case>
    </div>
  </div>
</template>
<script>
  import editCase from "./editCase";
  export default {
    name: "caseDetail",
    components:{
      editCase
    },
    props: ['navIndex'],
    data() {
      return {
        caseDetailShow:true,
      }
    },
    methods:{
      editCase(){
          this.caseDetailShow = false;
      }
    }
  }
</script>
<style scoped>
  .itemDetail {
    margin: 10px 40px;
  }

  .item-title {
    font-size: 18px;
    color: #555;
  }
  .item-assist-title {
    margin: 10px 0;
    position: relative;
    font-size: 12px ;
    color: #999;
  }
  .item-assist-title-edit {
    position: absolute;
    right: 0;
    top: 0;
  }
  .item-content {
    margin: 10px 0;
    color: #777;
    font-size: 14px;
  }
  .banner {
    width: 400px;
    height: 225px;
    background: #F4F4F4;
  }
  .banner img {
    width: 100%;
    height: 100%;
  }
</style>
