import Vue from 'vue'
import Vuex from 'vuex'
import { REPLACE,UPDATE } from '../store/mutations'

Vue.use(Vuex)

 const store = new Vuex.Store({
  state: {

    app: {
      reloadId:0,                                      //bot页面轮询id
      name:'智能服务机器人',                              //config默认机器人名
      config: false,                                   //是否显示二级菜单
      activeKey: 'bot',                                //一级菜单默认选中项
      defaultActiveSecondM:'config',                   //二级菜单active-key
      userName: '',                                    //用户名
      userInfo: {},                                    //用户信息
      // navIndex: '',                                    //标题
      isCollapse: false,                               //折叠菜单状态
      aSideWidth: '14vw',                              //菜单宽度
      breadArr:[{url:'/',name :'首页'}],                //面包屑数组


      PageIndex: 1,                                     //分页页数
      PageSize: 10,                                     //当前页的条数
      total: 0,                                         //列表总数
      searchStatus:null,                                //搜索状态
      tableData:[],                                     //列表数据
      loading: false,                                   //加载状态
      description: '',
      Key:'',
      SkillNo:'',
      quickQuizRecordId:null,
      id:null,
      // doingStatus: false,
      quickQuizArr:[],                                   //快速问答数组

      mainLoading:false,                                 //整页加载
      loadingText:null,                                  //全局加载时显示提示语
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
