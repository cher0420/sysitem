// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import Vue from 'vue'

import 'babel-polyfill'
import 'element-ui/lib/theme-chalk/index.css';

// import $ from 'jquery';
// Vue.prototype.$= $;



import 'whatwg-fetch'
import './style/element-variables.scss';

import {getLoginStatus} from "./permissions/permissions";

Vue.config.productionTip = false
//
// // 富文本框
// import '../static/summernote/dist/summernote.css'
// import '../static/summernote/dist/lang/summernote-zh-CN.js'



//登录
//vue render 函数在 getLoginStatus 内部执行，
getLoginStatus()
