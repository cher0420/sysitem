<template>
  <section class="yoy-title box-sizing border-bottom text-title" style="width: 98%;line-height: 1.5">
    <span class="align-middle dis-i-b line"></span>
    <span class="align-middle dis-i-b">
        {{title}}
    </span>
    <slot></slot>
  </section>
</template>
<script>
  export default {
    props: {
      title: String
    }
  }
</script>
<style lang="scss">
  @import '../style/index';
  @import '../style/var/color';
  $bread-background: #2a8ce7;
  $bread-height: 48px;
  $title-height: 65px;
  .primary-color{
    color: $primary-color;
  }
  .backHover{
    cursor: pointer;
  }
  .backHover:hover{
    color:$primary-color;
  }
  .align-middle{
    vertical-align: middle;
  }
  .line{
    display: inline-block;
    width:2px;
    height:24px;
    background-color: $primary-color;
    margin-right: 6px;
  }
  .yoy-bread .el-breadcrumb.single{
    font-size: 14px;
    color: #777;
    height: $bread-height;
    line-height: $bread-height;
    padding-right: 40px;
    padding-left: 40px;
    background: #f8f8f8;

    span:hover{
      /*text-decoration: underline;*/
    }
    .second,.notAllow{
      span:hover{
        text-decoration: none;
        cursor: default;
      }
    }
    .first,.index{
      span:hover{
        text-decoration: underline;
      }
    }
    .notAllow{
      span:hover{
        text-decoration: none;
        cursor: default;
      }
    }
  }
  .yoy-title{
    padding-top: 7px;
    margin-bottom: 30px;
    height: 100%;
    word-break: break-all;word-wrap: break-word;
  }
  .yoy-bread {
    .el-breadcrumb.yoy-title{
      height: $title-height;
      line-height: $title-height;
      padding-left: 0;
    }
  }
  .text-overflow-hidden{
    /*span{*/
    display: inline-block;
    width: 300px;
    overflow: hidden;
    height: 100%;
    text-overflow: ellipsis;
    white-space: nowrap;
    /*}*/

  }

</style>
