<template>
  <section>
    <web v-if="componentName === 'web'"></web>
    <config v-if="componentName === 'config'"></config>
  </section>
</template>
<script>
  import Web from './web/index'
  import Config from './config/index'
  import store from '../../../store/index'
  import {REPLACE} from "../../../store/mutations";
  export default {
    components:{
      Web,
      Config
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
