// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import Vue from 'vue'


import 'babel-polyfill'

import App from './App';
import router from './router';
import {store} from './storee/store'
import 'element-ui/lib/theme-chalk/index.css';

// import $ from 'jquery';
// Vue.prototype.$= $;

// 富文本编辑框
// import VueQuillEditor from 'vue-quill-editor'
// import 'quill/dist/quill.core.css'
// import 'quill/dist/quill.snow.css'
// import 'quill/dist/quill.bubble.css'
// Vue.use(VueQuillEditor, /* { default global options } */)

//gai

import 'whatwg-fetch'
import './style/element-variables.scss';
import {getLoginStatus} from "./permissions/permissions";
Vue.config.productionTip = false

//登录
getLoginStatus()

/* eslint-disable no-new */
setTimeout(
  () =>{
    new Vue({
      el: '#app',
      store,
      router,
      components: { App },
      template: '<App/>'
    })
  },400
)


