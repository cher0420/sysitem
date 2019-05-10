import Vue from 'vue'
import Router from 'vue-router'
import Layout from '../layout/Layout'

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
          require(["../page/dashboard/index"], resolve),
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
          require(["../page/skill/index"], resolve),
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
          require(["../page/custom/index"], resolve),
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
          require(["../page/authority/index"], resolve),
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
          require(["../page/opinion/index"], resolve),
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
        path:'config/config',
        component: resolve =>
          require(["../page/bot/config/config/index"], resolve),
        name: 'config',
      },
      {
        path:'config/web',
        component: resolve =>
          require(["../page/bot/config/web/index"], resolve),
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
          require(["../page/bot/config/knowledgeQuiz/knowledgeDetail/index"], resolve),
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
          require(["../page/bot/config/weChatCompany/index"], resolve),
        name: 'config',
      },
      {
        path:'config/robot',
        component: resolve =>
          require(["../page/bot/config/robot/index"], resolve),
        name: 'config',
      },
      {
        path:'config/desktopApp',
        component: resolve =>
          require(["../page/bot/config/desktopApp/index"], resolve),
        name: 'config',
      },
      {
        path:'config/quicklyQA',
        component: resolve =>
          require(["../page/bot/config/quicklyQA/index"], resolve),
        name: 'config',
      },
      {
        path:'config/quicklyQA/createNewQA',  // 创建新问答
        component: resolve =>
          require(["../page/bot/config/quicklyQA/edit/index"], resolve),
        name: 'create',
      },
      {
        path:'config/quicklyQA/edit',  //  编辑答案
        component: resolve =>
          require(["../page/bot/config/quicklyQA/edit/index"], resolve),
        name: 'edit',
      },
      {
        path:'config/keywordResponse',   //  关键词回复
        component: resolve =>
          require(["../page/bot/config/keywordResponse/index"], resolve),
        name: 'config',
      },
      {
        path:'config/keywordResponse/addKeyword',   //  关键词回复
        component: resolve =>
          require(["../page/bot/config/keywordResponse/addKeyword/addKeyword"], resolve),
        name: 'create',
      },
      {
        path:'config/keywordResponse/editAnswer',   //  关键词回复
        component: resolve =>
          require(["../page/bot/config/keywordResponse/editAnswer/editAnswer"], resolve),
        name: 'create',
      },
      {
        path:'config/keywordResponse/repeatAnswer',   //  关键词回复
        component: resolve =>
          require(["../page/bot/config/keywordResponse/editAnswer/repeatAnswer"], resolve),
        name: 'create',
      },
      {
        path:'config/keywordResponse/updateAnswer',   //  关键词回复
        component: resolve =>
          require(["../page/bot/config/keywordResponse/editAnswer/updateAnswer"], resolve),
        name: 'edit',
      },
      {
        path:'config/guide',   //  引导问题
        component: resolve =>
          require(["../page/bot/config/guide/index"], resolve),
        name: 'config',
      },
    ]
  }
]
const root = [{
  path: '/',
  component: Layout,
  redirect: '/dashboard',
  name: 'dashboard',
  hidden: true,
  children: [{
    path: 'dashboard',
    name: 'dashboard',
    component: resolve =>
      require(["../page/dashboard/index"], resolve),
  }]
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
