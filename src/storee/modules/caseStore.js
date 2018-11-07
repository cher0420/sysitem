

  const  caseStore = {

  state: {
    indexPage:true,
    indexPageDetail:false,
    createPage:false,
  },
  getters: {

  },
  mutations: {
    detailshow:(state) =>{
      state.indexPage = false;
      state.indexPageDetail = true;
      state.createPage =false;
    },
    indexCaseShow:(state) =>{
      state.indexPage = true;
      state.indexPageDetail = false;
      state.createPage =false;
    },
    createCaseShow:(state) =>{
      state.indexPage = false;
      state.indexPageDetail = false;
      state.createPage = true;
    }

  },
  actions: {
    detailshow:(context)=>{
      context.commit("detailshow")
    },
    indexCaseShow:(context)=>{
      context.commit("indexCaseShow")
    },
    createCaseShow:(context)=>{
      context.commit("createCaseShow")
    },
  }



}

export default  caseStore
