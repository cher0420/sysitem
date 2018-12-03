const createrNewQA = {

  state: {
    questionDis: true, // 问题可修改
    keywordsDis: true // 关键词可修改
  },
  getters: {
    questionDis: (state) => {
      return state.questionDis;  // 问题可修改
    },
    keywordsDis: (state) => {
      return state.keywordsDis; // 关键词可修改
    },


  },
  mutations: {
    questionNext: (state) => {
      state.questionDis = false; // 问题不可修改
    },
    questionLast: (state) => {
      state.questionDis = true; // 问题可修改
    },
    keywordsNext: (state, payload) => {
      if (payload > 1 &&  payload < 5) {
      state.keywordsDis = false; // 关键词不可修改
      }
    },
    keywordsLast: (state) => {
      state.keywordsDis = true; // 关键词可修改
    },
  },
  actions: {
    questionNext: (context) => {
      context.commit("questionNext")  // 问题不可修改
    },
    questionLast: (context) => {
      context.commit("questionLast")  // 问题可修改
    },
    keywordsNext: (context, payload) => {
        context.commit("keywordsNext", payload)  // 关键词不可修改
    },
    keywordsLast: (context) => {
      context.commit("keywordsLast")  // 关键词可修改
    },


  }
}

export default createrNewQA
