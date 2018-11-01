<template>
  <iframe :src="url" frameborder="0" style="width: 100%;height: 100%;"></iframe>
</template>
<style scoped>
</style>
<script>
  import URL from '../../host/baseUrl'

  export default{
    data () {
      return {
        url: URL.baseUrl + '/WebTalk/Index.html'
      }
    },
    methods: {
    }
  }
</script>
