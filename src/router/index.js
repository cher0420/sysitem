import Vue from 'vue'
import Router from 'vue-router'
import Layout from '../layout/Layout'
import {MENUS} from "../constants/constants";

Vue.use(Router)
let arr = []
let obj = {}
// for(let v of MENUS){
//   let children = [{
//     path: '/',
//     name: v.id,
//     title:v.chineseName,
//     component: () => import(`../page/${v.path}/index`)
//   }]
//   for(let value of v.children){
//     let childrenObj = {
//       path: value.path,
//       name: value.id,
//       component: () => import(`../page/${v.path}/${value.path}/index`),
//       children:[
//         {
//           path:'/',
//           name:'config',
//           title:value.chineseName,
//           component: ()=>import(`../page/${v.path}/${value.path}/index`),
//         },
//       ]
//     }
//     children = [...children,childrenObj]
//   }
//   obj={
//     path:`/${v.id}`,
//     component:Layout,
//     name:v.id,
//     children:children
//   }
//   arr.push(obj)
// }
arr = [
  {
    path:'/dashboard',
    component: Layout,
    name: 'dashboard',
    children:[
      {
        path:'/',
        name: 'dashboard',
        // component: () => import('../page/wait/index'),
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
        //  component:() =>import('../page/wait/index')
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
        //   component:() =>import('../page/wait/index')
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
        //    component:() =>import('../page/wait/index')
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
        //  component:() =>import('../page/wait/index')
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
        //   component: () =>import('../page/bot/index'),

        component: resolve =>
          require(["../page/bot/index"], resolve),
        name: 'bot',
        children:[
        ]
      },
      {
        path:'config',
        //   component: () =>import('../page/bot/config/config/index'),
        component: resolve =>
          require(["../page/bot/config/config/index"], resolve),
        name: 'config',
      },
      // {
      //   path:'config/config',
      //   component: () =>import('../page/bot/config/config/index'),
      //   name: 'config',
      // },
      {
        path:'config/web',
        //  component: () =>import('../page/bot/config/web/index'),
        //  标记
        component: resolve =>
          require(["../page/bot/config/web/index"], resolve),
        name: 'config',
      },
      {
        path:'config/questionBuild',
        //   component: () =>import('../page/bot/config/questionBuild/index'),
        component: resolve =>
          require(["../page/bot/config/questionBuild/index"], resolve),
        name: 'config',
      },
      {
        path:'config/knowledgeQuiz',
        //    component: () =>import('../page/bot/config/knowledgeQuiz/index'),
        component: resolve =>
          require(["../page/bot/config/knowledgeQuiz/index"], resolve),
        name: 'config',
      },
      {
        path:'config/knowledgeDetail',
        //    component: () =>import('../page/bot/config/knowledgeDetail/index'),、
        component: resolve =>
          require(["../page/bot/config/knowledgeDetail/index"], resolve),
        name: 'config',
      },
      {
        path:'config/weChatService',
        //   component: () =>import('../page/bot/config/weChatService/index'),
        component: resolve =>
          require(["../page/bot/config/weChatService/index"], resolve),
        name: 'config',
      },
      {
        path:'config/weChatCompany',
        //   component: () =>import('../page/wait/index'),
        component: resolve =>
          require(["../page/wait/index"], resolve),
        name: 'config',
      },
      {
        path:'config/robot',
        //   component: () =>import('../page/wait/index'),
        component: resolve =>
          require(["../page/wait/index"], resolve),
        name: 'config',
      },
      {
        path:'config/desktopApp',
        //  component: () =>import('../page/wait/index'),
        component: resolve =>
          require(["../page/wait/index"], resolve),
        name: 'config',
      },
      {
        path:'config/caseStore',
        //   component: () =>import('../page/bot/config/caseStore/index'),
        component: resolve =>
          require(["../page/bot/config/caseStore/index"], resolve),
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
    //  component: () => import('../page/bot/index')
    component: resolve =>
      require(["../page/bot/index"], resolve),
  }]
},
  {
    path:'/webTalk',
    //   component: () => import('../page/webtalk/index')
    component: resolve =>
      require(["../page/webtalk/index"], resolve),
  },
  {
    path:'/webTalk/v2',
    //  component: () => import('../page/v2/index')
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
  routes: routes
}
export default new Router(router)
