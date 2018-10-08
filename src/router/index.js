import Vue from 'vue'
import Router from 'vue-router'
import Layout from '../layout/Layout'
import {MENUS} from "../constants/constants";

Vue.use(Router)
let arr = []
for(let v of MENUS){
  const obj={
    path:`/${v.id}`,
    component:Layout,
    name:v.id,
    children: [
      {
      path: '/',
      name: v.id,
      component: () => import(`../page/test/index`)
      },
      {
        path: '/create',
        name: v.id,
        component: () => import(`../page/test/index`)
      },
      {
        path: '/edit',
        name: v.id,
        component: () => import(`../page/test/index`)
      },
    ]
  }
  arr.push(obj)
}
const root = [{
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      name: 'dashboard',
      component: () => import('../page/dashboard/index')
    }]
  }]
const routes = [...root,...arr]
const router = {
  routes: routes
}
export default new Router(router)
