import Vue from 'vue'
import Vuex from 'vuex'
import { REPLACE,UPDATE } from '../store/mutations'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    app: {
      config: false,
      userName: '',
      userInfo: {},
      navIndex: '',
      isCollapse: false,
      aSideWidth: '240px',
      breadArr:[{url:'/',name :'首页'}],

      PageIndex: 1,                                     //分页页数
      PageSize: 10,                                     //当前页的条数
      total: 0,                                         //列表总数
      searchStatus:null,
      tableData:[],
      loading: false,
      description: '',
    },
  },
  mutations: {
    [REPLACE] (state, payload) {
      state.app = {
        ...state.app,
        ...payload
      }
    },
    [UPDATE] (state, payload) {
      state.app.tableData[payload.index] = payload.value
    }
  },
  actions: {
    [REPLACE] (context, payload) {
      context.commit(REPLACE, payload)
    },
    [UPDATE] (context, payload) {
      context.commit(UPDATE, payload)
    }
  }
})

export default store
