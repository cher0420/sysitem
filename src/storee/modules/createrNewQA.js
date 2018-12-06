import {TOKEN} from "../../constants/constants";
import {getCookies} from "../../utils/cookie";
import base from "../../host/baseUrl"


const createrNewQA = {

  state: {
    questionDis: true, // 问题可修改
    keywordsDis: true ,// 关键词可修改
    Question:"",  // 问题
    keywords:"" , // 关键词
    newDataDis:true, // 创建 修改 页面展示


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


  },
  mutations: {
    questionNext: (state,payload) => {
      state.questionDis = false; // 问题不可修改
    },
    questionLast: (state) => {
      state.questionDis = true; // 问题可修改
    },
    keywordsNext: (state, payload) => {
      if (payload > 1 && payload < 5) {
        state.keywordsDis = false; // 关键词不可修改
      }
    },
    keywordsLast: (state) => {
      state.keywordsDis = true; // 关键词可修改
    },
    newDataDis:(state) => {
      state.newDataDis = true; // 展示
    },
    newDataHidd:(state) => {
      state.newDataDis = false; // 隐藏
    },
  },
  actions: {

    questionNext: (context,payload) => {
      context.commit("questionNext")  // 问题不可修改
    },
    questionLast: (context,payload) => {
      context.commit("questionLast")  // 问题可修改
    },
    keywordsNext: (context, payload) => {
      context.commit("keywordsNext", payload)  // 关键词不可修改
    },
    keywordsLast: (context) => {
      context.commit("keywordsLast")  // 关键词可修改
    },
    newDataDis:(context) => {
      context.commit("newDataDis") // 展示
    },
    newDataHid:(context) => {
      context.commit("newDataHidd")// 隐藏
    },


  }
}

export default createrNewQA
