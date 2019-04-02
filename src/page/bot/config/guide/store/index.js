import Vuex from 'vuex'
import { REPLACE,UPDATE,FILTER,DETAILS } from "./mutations";

const store = new Vuex.Store({
  state: {
    isSpread: false,
    Enable: false,
    app:{
      Data:{
        ID: '',
        BotConfigId: '',
        GuideDescription: '',
        Channels: '',
        Details: [],
      },
    },
    dataAll:{
      total: 0,
      tableData:[
      ],
      originData:[]
    },
  },
  mutations: {
    [REPLACE] (state, payload) { //更新所有一层数据
      state.app = {
        ...state.app,
        ...payload
      }
    },
    [DETAILS] (state, payload) { //更新详情
      state.app.Data = {
        ...state.app.Data,
        ...payload
      }
    },
    [UPDATE] (state, payload) {
      state.isSpread = payload.isSpread
    },
    [FILTER] (state, payload) {
      state.dataAll = {
        ...state.dataAll,
        ...payload
      }
    },
  },
  actions: {
    [REPLACE] (context, payload) {  // replace
      context.commit(REPLACE, payload)
    },
    [UPDATE] (context, payload){
      context.commit(UPDATE, payload)
    },
    [FILTER] (context, payload){
      context.commit(FILTER, payload)
    },
    [DETAILS] (context, payload){ //更新详情
      context.commit(DETAILS, payload)
    }
  }
})

export default store
