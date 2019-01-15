import Vue from 'vue'
import Vuex from 'vuex'
import { REPLACE,UPDATE } from '../store/mutations'

Vue.use(Vuex)

 const store = new Vuex.Store({
  state: {

    app: {
      reloadId:0,
      name:'智能服务机器人',
      config: false,
      activeKey: 'bot',
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
      Key:'',
      SkillNo:'',
      quickQuizRecordId:null,
      id:null,
      // doingStatus: false,
      quickQuizArr:[],

      mainLoading:false,
      loadingText:null,
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
    // detailshow:(state) =>{
    //   state.indexPage = false;
    //  state.indexPageDetail = true;
    // }
  },
  actions: {
    [REPLACE] (context, payload) {  // replace
      context.commit(REPLACE, payload)
    },
    [UPDATE] (context, payload) {  // update
      context.commit(UPDATE, payload)
    },
    // detailshow:(context)=>{
    //   context.commit("detailshow")
    // }
  }
})

 export default store
