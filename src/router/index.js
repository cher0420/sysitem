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
        component: () => import('../page/wait/index'),
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
        component:() =>import('../page/wait/index')
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
        component:() =>import('../page/wait/index')
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
        component:() =>import('../page/wait/index')
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
        component:() =>import('../page/wait/index')
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
        component: () =>import('../page/bot/index'),
        name: 'bot',
        children:[
        ]
      },
      {
        path:'config',
        component: () =>import('../page/bot/config/config/index'),
        name: 'config',
      },
      // {
      //   path:'config/config',
      //   component: () =>import('../page/bot/config/config/index'),
      //   name: 'config',
      // },
      {
        path:'config/web',
        component: () =>import('../page/bot/config/web/index'),
        name: 'config',
      },
      {
        path:'config/questionBuild',
        component: () =>import('../page/bot/config/questionBuild/index'),
        name: 'config',
      },
      {
        path:'config/knowledgeQuiz',
        component: () =>import('../page/bot/config/knowledgeQuiz/index'),
        name: 'config',
      },
      {
        path:'config/knowledgeDetail',
        component: () =>import('../page/bot/config/knowledgeDetail/index'),
        name: 'config',
      },
      {
        path:'config/weChatService',
        component: () =>import('../page/bot/config/weChatService/index'),
        name: 'config',
      },
      {
        path:'config/weChatCompany',
        component: () =>import('../page/wait/index'),
        name: 'config',
      },
      {
        path:'config/robot',
        component: () =>import('../page/wait/index'),
        name: 'config',
      },
      {
        path:'config/desktopApp',
        component: () =>import('../page/wait/index'),
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
      component: () => import('../page/bot/index')
    }]
  },
  {
    path:'/webTalk',
    component: () => import('../page/webtalk/index')
  },
  {
    path:'/webTalk/v2',
    component: () => import('../page/v2/index')
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
