import Vue from 'vue'
import Router from 'vue-router'
import Layout from '../layout/Layout'
import {MENUS} from "../constants/constants";

Vue.use(Router)
let arr = []
let obj = {}
for(let v of MENUS){
  let children = [{
    path: '/',
    name: v.id,
    component: () => import(`../page/${v.path}/index`)
  }]
  for(let value of v.children){
    let childrenObj = {
      path: value.path,
      name: value.id,
      component: () => import(`../page/${v.path}/${value.path}/index`)
    }
    children = [...children,childrenObj]
  }
  obj={
    path:`/${v.id}`,
    component:Layout,
    name:v.id,
    children:children
  }
  arr.push(obj)
}
console.log('===',arr)
const root = [{
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      name: 'dashboard',
      component: () => import('../page/wait/index')
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
  routes: routes
}
export default new Router(router)
