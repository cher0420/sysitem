<template>
  <section>
    <web v-if="componentName === 'web'"></web>
    <config v-else-if="componentName === 'config'"></config>
    <weChatService v-else-if="componentName === 'weChatService'"></weChatService>
    <question-quiz v-else-if="componentName === 'knowledgeQuiz'"></question-quiz>
    <question-detail v-else-if="componentName === 'questionDetail'"></question-detail>
  </section>
</template>
<script>
  import Web from './web/index'
  import Config from './config/index'
  import WeChatService from './weChatService'
  import questionQuiz from './questionQuiz'
  import questionDetail from './questionDetail'
  import store from '../../../store/index'
  import {REPLACE} from "../../../store/mutations";
  export default {
    components:{
      Web,
      Config,
      WeChatService,
      questionQuiz,
      questionDetail
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
