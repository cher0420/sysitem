import Vuex from 'vuex'
import { REPLACE,UPDATE } from "./mutations";

const store = new Vuex.Store({
  state: {
    isSpread: false,
    Data:{
      ID: '',
      BotConfigId: '',
      GuideDescription: '',
      Channels: '',
      Details: [
        {
          ID: '1',
          QuestionId: '1',
          Question: '居住证办理1',
          QuestionType: '',
          Sort: 1,
        },
        {
          ID: '2',
          QuestionId: '2',
          Question: '居住证办理2',
          QuestionType: '',
          Sort: 2,
        },
        {
          ID: '3',
          QuestionId: '3',
          Question: '居住证办理3',
          QuestionType: '',
          Sort: 3,
        },
        {
          ID: '4',
          QuestionId: '4',
          Question: '居住证办理4',
          QuestionType: '',
          Sort: 4,
        },
        {
          ID: '5',
          QuestionId: '5',
          Question: '居住证办理5',
          QuestionType: '',
          Sort: 5,
        }
      ],
    },
    tableData:
      [
        {
          ID: '1',
          QuestionId: '1',
          Question: '居住证办理1',
          QuestionType: '',
          Sort: 1,
        },
        {
          ID: '2',
          QuestionId: '2',
          Question: '居住证办理2',
          QuestionType: '',
          Sort: 2,
        },
        {
          ID: '3',
          QuestionId: '3',
          Question: '居住证办理3',
          QuestionType: '',
          Sort: 3,
        },
        {
          ID: '4',
          QuestionId: '4',
          Question: '居住证办理4',
          QuestionType: '',
          Sort: 4,
        },
        {
          ID: '5',
          QuestionId: '5',
          Question: '居住证办理5',
          QuestionType: '',
          Sort: 5,
        },
        {
          ID: '6',
          QuestionId: '6',
          Question: '居住证办理6',
          QuestionType: '',
          Sort: 6,
        }
      ],
    originData:[]
  },
  mutations: {
    [REPLACE] (state, payload) {
      state.Data = {
        ...state.Data,
        ...payload
      }
      console.log(state)
    },
    [UPDATE] (state, payload) {
      state.isSpread = payload.isSpread
    },
  },
  actions: {
    [REPLACE] (context, payload) {  // replace
      context.commit(REPLACE, payload)
    },
    [UPDATE] (context, payload){
      context.commit(UPDATE, payload)
    }
  }
})

export default store
