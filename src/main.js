// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import Vue from 'vue'

import 'babel-polyfill'
import 'element-ui/lib/theme-chalk/index.css';

import $ from 'jquery';
Vue.prototype.$= $;

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
//vue render 函数在 getLoginStatus 内部执行，
getLoginStatus()


