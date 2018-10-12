<template>
  <section>
    <section>
      <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: item.url }" v-for="item in breadArr">{{item.name}}</el-breadcrumb-item>
    </el-breadcrumb>
    </section>
    <router-view></router-view>
  </section>
</template>
<script>
  import {STR} from '../../constants/constants'
  import {hashChange} from "../../permissions/permissions";
  import store from '../../store/index';

  export default {
    data() {
      return {

      }
    },
    computed: {
      breadArr(){
        return store.state.app.breadArr
      }
    },
    watch: {
      '$route'(to, from) {
        // console.log(this.$route)
      }
    },
    created() {
      hashChange()
    },
    methods: {
      regUrl() {

      }
    }
  }
</script>
