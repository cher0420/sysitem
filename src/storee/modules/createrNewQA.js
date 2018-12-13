import {TOKEN} from "../../constants/constants";
import {getCookies} from "../../utils/cookie";
import base from "../../host/baseUrl"


const createrNewQA = {

  state: {
    questionDis: true, // 问题可修改
    keywordsDis: true,// 关键词可修改
    // Question:"",  // 问题
    // keywords:"" , // 关键词
    newDataDis: true, // 创建 修改 页面展示
    yourselfStatus :true, //


  },
  getters: {
    questionDis: (state) => {
      return state.questionDis;  // 问题可修改
    },
    keywordsDis: (state) => {
      return state.keywordsDis; // 关键词可修改
    },
    newDataDis: (state) => {
      return state.newDataDis; // // 展示
    },
    yourselfStatus: (state) => {
      return state.yourselfStatus; // // 展示
    },


  },
  mutations: {
    questionNext: (state, payload) => {
      state.questionDis = false; // 问题不可修改
      state.keywordsDis = true; // 关键词可修改
    },
    questionLast: (state) => {

      state.yourselfStatus = true; // 自定义关键词
      state.questionDis = true; // 问题可修改
      state.keywordsDis = true; // 关键词可修改
    },
    yourselfStatus: (state) => {

      state.yourselfStatus = false; // 自定义关键词

    },
    keywordsNext: (state, payload) => {
      if (payload > 1 && payload < 5) {
        state.questionDis = false; // 问题不可修改
        state.keywordsDis = false; // 关键词不可修改
      }
    },
    keywordsLast: (state) => {

      state.keywordsDis = true; // 关键词可修改
    },
    newDataDis: (state) => {   // 子组件不展示
      state.newDataDis = true; // 展示
    },
    newDataHidd: (state) => {  // 答案已存在组件展示
      state.newDataDis = false; // 隐藏
    },
    yourselfStatusFalse: (state) => {  //
      state.yourselfStatus = true; // 关键词可修改
    },
  },
  actions: {

    questionNext: (context, payload) => {
      context.commit("questionNext")  // 问题不可修改
    },
    questionLast: (context, payload) => {
      context.commit("questionLast")  // 问题可修改
    },
    keywordsNext: (context, payload) => {
      context.commit("keywordsNext", payload)  // 关键词不可修改
    },
    keywordsLast: (context) => {
      context.commit("keywordsLast")  // 关键词可修改
    },
    newDataDis: (context) => {
      context.commit("newDataDis") // 展示
    },
    newDataHid: (context) => {
      context.commit("newDataHidd")// 隐藏
    },
    yourselfStatusAdd: (context) => {
      // console.log(1111111111)
      context.commit("yourselfStatus")//  创建关键词
    },
    yourselfStatusLast: (context) => {
      // console.log(1111111111)
      context.commit("yourselfStatusFalse")//  重新添加
    },


  }
}

export default createrNewQA
