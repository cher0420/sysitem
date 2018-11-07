import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);


// 案例库模块
import caseStore from "./modules/caseStore"

export const store = new Vuex.Store({

  modules: {
    caseStore
  },


});


