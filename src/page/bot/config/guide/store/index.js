import Vuex from 'vuex'
import { REPLACE } from "./mutations";

const store = new Vuex.Store({
  state: {
    Data:{
      ID: '',
      BotConfigId: '',
      GuideDescription: '',
      Channels: '',
      Details: [{
        ID: '',
        QuestionId: '',
        Question: '',
        QuestionType: '',
        Sort: '',
      }],
    }
  },
  mutations: {
    [REPLACE] (state, payload) {
      state.Data = {
        ...state.Data,
        ...payload
      }
    },
  },
  actions: {
    [REPLACE] (context, payload) {  // replace
      context.commit(REPLACE, payload)
    },
  }
})

export default store
