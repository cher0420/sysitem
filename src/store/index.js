import Vue from 'vue'
import Vuex from 'vuex'
import { REPLACE } from '../store/mutations'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    app: {
      loading: false,
      menus:[
        {id:'dashboard',chineseName:'仪表盘',englishName:'dashboard'},
        {id:'bot',chineseName:'机器人列表',englishName:'bot'},
        {id:'skill',chineseName:'机器人技能',englishName:'skill'},
        {id:'custom',chineseName:'定制服务',englishName:'custom'},
        {id:'opinion',chineseName:'意见反馈',englishName:'opinion'},
        {id:'authority',chineseName:'权限管理',englishName:'authority'},
      ],
      navIndex: 'dashboard',
      isCollapse: false,
      aSideWidth: '240px',
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
