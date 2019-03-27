<template>
  <div v-loading="loadingEdit" class="p-relative">
       <section class="full-width">引导语设置</section>
       <textarea name="" id="" cols="30" rows="10"></textarea>
        <store></store>
  </div>
</template>
<script>
  import knowledgeStore from './knowledgeStore'
  export default {
    data() {
      return {

      }
    },
    components:{
      store: knowledgeStore
    },
  }
</script>
<style scoped lang="scss">
  @import "../../../../style/index.scss";
//   .middle{
//     vertical-align: middle;
//   }
//   .margin-left-20{
//     margin-left: 20px;
//   }
//   .download{
//     cursor: pointer;
//   }
//   .download:hover{
//     opacity: 0.8;
//     text-decoration: underline;
//   }
//   .f-l{
//     float: left;
//   }
//   .f-r{
//     float: right;
//   }
//   /*component*/
//   .done {
//     margin-bottom: 20px;
//   }
//   .transition{
//       transition: margin 1s;
//   }
//   /*do some thing*/
//   .hover {
//     i {
//       margin-right: 6px;
//       font-weight: 500;
//     }
//   }
//   .hover:hover {
//     text-decoration: underline;
//     cursor: pointer;
//   }
//   .edit {
//     color: #6c6c6c;
//   }
//   .edit:hover {
//     color: $primary-color;
//   }
//   .delete {
//     color: #999;
//     margin-left: 24px;
//   }
//   .delete:hover {
//     color: $danger;
//   }
//   .disabled.delete, .disabled.edit{
//     color: $disabled;
//     text-decoration: none;
//   }
//   .stop{
//     background: $danger;
//     color: $fff;
//   }
//   .stop:hover{
//     background: $fff;
//     color: $danger;
//   }
//   .has-stop{
//     position: absolute;
//     right: 0;
//   }
//   .do{
//     text-align: right;
//     margin-right: -100px;
//   }
//   //view
//   .responseBack {
//     position: absolute;
//     top: 50%;
//     left: 50%;
//     transform: translate( -50%, -50%);
//     transition: transform 1s;
// }
//   .nonBack{
//     position: absolute;
//     top: 0;
//     left: 50%;
//     transform: translate( -50%, -50%);
//     transition: transform 1s;
//   }
</style>
