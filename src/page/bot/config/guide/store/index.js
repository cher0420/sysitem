import Vuex from 'vuex'
import { RESTART,REPLACE,UPDATE,FILTER,DETAILS,APP } from "./mutations";

const store = new Vuex.Store({
  state: {
    isSpread: false,

    app:{
      Data:{
        serviceId:'',
        ID: '',//
        Enable: false,
        BotConfigId: '',
        GuideDescription: '',
        Channels: '',
        Details: [],
      },
    },
    dataAll:{
      total: 0,
      tableData:[
        // {
        //   ID: '1',
        //   QuestionId: '1',
        //   Question: '居住证办理1',
        //   QuestionType: '',
        //   Sort: 1,
        // },
        // {
        //   ID: '2',
        //   QuestionId: '2',
        //   Question: '居住证办理2',
        //   QuestionType: '',
        //   Sort: 2,
        // },
        // {
        //   ID: '3',
        //   QuestionId: '3',
        //   Question: '居住证办理3',
        //   QuestionType: '',
        //   Sort: 3,
        // },
        // {
        //   ID: '4',
        //   QuestionId: '4',
        //   Question: '居住证办理4',
        //   QuestionType: '',
        //   Sort: 4,
        // },
        // {
        //   ID: '5',
        //   QuestionId: '5',
        //   Question: '居住证办理5',
        //   QuestionType: '',
        //   Sort: 5,
        // },
        // {
        //   ID: '6',
        //   QuestionId: '6',
        //   Question: '居住证办理6',
        //   QuestionType: '',
        //   Sort: 6,
        // }
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
    [RESTART] (state, payload) { //RESTART
      state.app = {
        Data:{
          ...state.app.Data,
          ID: '',//
          Enable: false,
          BotConfigId: '',
          GuideDescription: '',
          Channels: '',
          Details: [],
        },
      }
    },
    [DETAILS] (state, payload) { //更新详情
      state.app.Data = {
        ...state.app.Data,
        ...payload
      }
    },
    [APP] (state, payload) { //更新详情
      state.app = {
        ...state.app,
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
    [RESTART] (context, payload) {  // RESTART
      context.commit(RESTART, payload)
    },
    [UPDATE] (context, payload){
      context.commit(UPDATE, payload)
    },
    [FILTER] (context, payload){
      context.commit(FILTER, payload)
    },
    [DETAILS] (context, payload){ //更新详情
      context.commit(DETAILS, payload)
    },
    [APP] (context, payload){ //更新详情
      context.commit(APP, payload)
    }
  }
})

export default store
