<template>
  <section></section>
</template>
<script>
  import store from './store/'
  import {REPLACE} from './store/mutations'
  export default {
    name: 'TapItem',
    created(){
      store.dispatch(REPLACE,{lists:[1]})
    }
  }
</script>
