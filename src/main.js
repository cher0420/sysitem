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

// 富文本框
import '../static/UE/ueditor.config.js'
import '../static/UE/ueditor.all.min.js'
import '../static/UE/lang/zh-cn/zh-cn.js'
import '../static/UE/ueditor.parse.min.js'

import 'whatwg-fetch'
import './style/element-variables.scss';
import {getLoginStatus} from "./permissions/permissions";
Vue.config.productionTip = false

//登录
getLoginStatus()

//使用钩子函数对路由进行权限跳转
// router.beforeEach((to, from, next) => {
//   const role = localStorage.getItem('ms_username');
//   if(!role && to.path !== '/login'){
//     next('/login');
//   }else if(to.meta.permission){
//     // 如果是管理员权限则可进入
//     role === 'admin' ? next() : next('/403');
//   }else{
//     // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
//     if(navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor'){
//       Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
//         confirmButtonText: '确定'
//       });
//     }else{
//       next();
//     }
//   }
// })



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
  },500
)


