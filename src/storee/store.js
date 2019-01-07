import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);



import caseStore from "./modules/caseStore" // 案例库模块
import createrNewQA from "./modules/createrNewQA" // 快速问答/创建新问答


export const store = new Vuex.Store({

  modules: {
    caseStore,
    createrNewQA,
  },


});


