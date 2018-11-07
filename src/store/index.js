import Vue from 'vue'
import Vuex from 'vuex'
import { REPLACE,UPDATE } from '../store/mutations'

Vue.use(Vuex)

 const store = new Vuex.Store({
  state: {

    app: {
      config: false,
      defaultActiveSecondM:'config',                   //二级菜单active-key
      userName: '',
      userInfo: {},
      navIndex: '',
      navIndexSecond:'',
      isCollapse: false,
      aSideWidth: '14vw',
      breadArr:[{url:'/',name :'首页'}],


      PageIndex: 1,                                     //分页页数
      PageSize: 10,                                     //当前页的条数
      total: 0,                                         //列表总数
      searchStatus:null,
      tableData:[],
      loading: false,
      description: '',

      mainLoading:false
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
    },
    detailshow:(state) =>{
      state.indexPage = false;
     state.indexPageDetail = true;
    }
  },
  actions: {
    [REPLACE] (context, payload) {
      context.commit(REPLACE, payload)
    },
    [UPDATE] (context, payload) {
      context.commit(UPDATE, payload)
    },
    detailshow:(context)=>{
      context.commit("detailshow")
    }
  }
})

 export default store
