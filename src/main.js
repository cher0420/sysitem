// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import Vue from 'vue'

import 'babel-polyfill'
import 'element-ui/lib/theme-chalk/index.css';
import { Loading } from 'element-ui';
import 'whatwg-fetch'
import './style/element-variables.scss';

import {store} from "./storee/store";
import router from "./router";

import App from './App';

Vue.config.productionTip = false

//登录

//vue render 函数在 getLoginStatus 内部执行，
let loadingInstance = Loading.service({ fullscreen: true });
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
loadingInstance.close();
