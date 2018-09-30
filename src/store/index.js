import Vue from 'vue'
import Vuex from 'vuex'
import { REPLACE } from '../store/mutations'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    app: {
      loading: false,
      navIndex: 'dashboard',
    },
  },
  mutations: {
    [REPLACE] (state, payload) {
      state.app = {
        ...state.app,
        ...payload
      }
    }
  },
  actions: {
    [REPLACE] (context, payload) {
      context.commit(REPLACE, payload)
    },
  }
})

export default store
