// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import 'babel-polyfill'
import 'whatwg-fetch'
import router from './router';
import 'element-ui/lib/theme-chalk/index.css';
import './style/element-variables.scss';
import App from './App';
import {getLoginStatus} from "./permissions/permissions";

Vue.config.productionTip = false

//登录
getLoginStatus()

/* eslint-disable no-new */
setTimeout(
  () =>{
    new Vue({
      el: '#app',
      router,
      components: { App },
      template: '<App/>'
    })
  },400
)

