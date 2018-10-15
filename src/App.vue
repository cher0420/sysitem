<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  import {getLoginStatus} from "./permissions/permissions";

  export default {
  name: 'App',
  created: function(){
    getLoginStatus()
  }
}
</script>

<style lang="scss">
  @import './style/index';
  @import './style/init.css';
  #app {

}
</style>
