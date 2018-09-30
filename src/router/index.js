import Vue from 'vue'
import Router from 'vue-router'
import Layout from '../layout/Layout'

Vue.use(Router)

export default new Router({
  routes: [
    {
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
    },
    {
      path: '/test',
      component: Layout,
      name: 'test',
      children: [{
        path: '/',
        name: 'test',
        component: () => import('../page/test/index')
      }]
    },
  ]
})
