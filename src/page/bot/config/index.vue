<template>
  <section>
    <web v-if="componentName === 'web'"></web>
    <config v-else-if="componentName === 'config'"></config>
    <weChatService v-else-if="componentName === 'weChatService'"></weChatService>
  </section>
</template>
<script>
  import Web from './web/index'
  import Config from './config/index'
  import WeChatService from './weChatService'
  import store from '../../../store/index'
  import {REPLACE} from "../../../store/mutations";
  export default {
    components:{
      Web,
      Config,
      WeChatService
    },
    data() {
      return {

      }
    },
    computed:{
      componentName(){
        return store.state.app.componentName
      }
    },
    created(){
      const arr = this.$route.path.split('/')
      const componentName = arr[arr.length-1]
      store.dispatch(REPLACE,{componentName})
    },
    methods: {

    }
  }
</script>
<style lang="scss" scoped>

</style>
