import Vue from 'vue'
import Router from 'vue-router'
import Layout from '../layout/Layout'
import {MENUS} from "../constants/constants";

Vue.use(Router)
const arr = [
  {
    path:'/dashboard',
    component: Layout,
    name: 'dashboard',
    children:[
      {
        path:'/',
        name: 'dashboard',
        component: resolve =>
          require(["../page/wait/index"], resolve),
      }
    ]
  },
  {
    path:'/skill',
    name:'skill',
    component: Layout,
    children:[
      {
        path:'/',
        name:'skill',
        component: resolve =>
          require(["../page/wait/index"], resolve),
      }
    ]
  },
  {
    path:'/custom',
    name:'custom',
    component: Layout,
    children:[
      {
        path:'/',
        name:'custom',
        component: resolve =>
          require(["../page/wait/index"], resolve),
      }
    ]
  },
  {
    path:'/authority',
    name:'authority',
    component: Layout,
    children:[
      {
        path:'/',
        name:'authority',
        component: resolve =>
          require(["../page/wait/index"], resolve),
      }
    ]
  },
  {
    path:'/opinion',
    name:'opinion',
    component: Layout,
    children:[
      {
        path:'/',
        name:'opinion',
        component: resolve =>
          require(["../page/wait/index"], resolve),
      }
    ]
  },
  {
    path:'/bot',
    component: Layout,
    name: 'bot',
    children:[
      {
        path:'/',
        component: resolve =>
          require(["../page/bot/index"], resolve),
        name: 'bot',
        children:[
        ]
      },
      {
        path:'config',
        component: resolve =>
          require(["../page/bot/config/config/index"], resolve),
        name: 'config',
      },
      {
        path:'config/web',
        //  标记
        component: resolve =>
          require(["../page/bot/config/web/index"], resolve),
        name: 'config',
      },
      {
        path:'config/questionBuild',
        component: resolve =>
          require(["../page/bot/config/questionBuild/index"], resolve),
        name: 'config',
      },
      {
        path:'config/knowledgeQuiz',
        component: resolve =>
          require(["../page/bot/config/knowledgeQuiz/index"], resolve),
        name: 'config',
      },
      {
        path:'config/knowledgeQuiz/knowledgeDetail',
        component: resolve =>
          require(["../page/bot/config/knowledgeDetail/index"], resolve),
        name: 'detail',
      },
      {
        path:'config/weChatService',
        component: resolve =>
          require(["../page/bot/config/weChatService/index"], resolve),
        name: 'config',
      },
      {
        path:'config/weChatCompany',
        component: resolve =>
          require(["../page/wait/index"], resolve),
        name: 'config',
      },
      {
        path:'config/robot',
        component: resolve =>
          require(["../page/wait/index"], resolve),
        name: 'config',
      },
      {
        path:'config/desktopApp',
        component: resolve =>
          require(["../page/wait/index"], resolve),
        name: 'config',
      },
      {
        path:'config/caseStore',
        component: resolve =>
          require(["../page/bot/config/caseStore/index"], resolve),
        name: 'config',
      },
      {
        path:'config/QuicklyQA',
        component: resolve =>
          require(["../page/bot/config/QuicklyQA/index"], resolve),
        name: 'config',
      }
    ]
  }
]
const root = [{
  path: '/',
  component: Layout,
  redirect: '/bot',
  name: 'bot',
  hidden: true,
  children: [{
    path: 'bot',
    name: 'bot',
    component: resolve =>
      require(["../page/bot/index"], resolve),
  }]
},
  {
    path:'/webTalk',
    component: resolve =>
      require(["../page/webtalk/index"], resolve),
  },
  {
    path:'/webTalk/v2',
    component: resolve =>
      require(["../page/v2/index"], resolve),
  },
  {
    path: '*',
    name: 'Error',
    redirect: "/"
  }
]
const routes = [...root,...arr]

const router = {
  routes: routes,
  scrollBehavior(to,from,savedPosition){
    if(savedPosition){
      return savedPosition;
    }else{
      return {x:0,y:0}
    }
  },
}
export default new Router(router)
