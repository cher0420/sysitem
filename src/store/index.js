import Vue from 'vue'
import Vuex from 'vuex'
import { REPLACE,UPDATE } from '../store/mutations'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    app: {
      userName: '',
      userInfo: {},
      menus:[
        {id:'dashboard',chineseName:'仪表盘',englishName:'dashboard'},
        {id:'bot',chineseName:'机器人列表',englishName:'bot'},
        {id:'skill',chineseName:'机器人技能',englishName:'skill'},
        {id:'custom',chineseName:'定制服务',englishName:'custom'},
        {id:'opinion',chineseName:'意见反馈',englishName:'opinion'},
        {id:'authority',chineseName:'权限管理',englishName:'authority'},
      ],
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
      state.app.tableData[payload.index].StatusString = '测试时'
      console.log('state',state, payload)
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
