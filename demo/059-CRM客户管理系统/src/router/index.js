import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { title: '首页' }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import(/* webpackChunkName: "dashboard" */ '../views/dashboard.vue'),
    meta: { title: '仪表盘' }
  },
  {
    path: '/customers',
    name: 'customers',
    component: () => import(/* webpackChunkName: "customers" */ '../views/customers.vue'),
    meta: { title: 'Customers' }
  },
  {
    path: '/tasks',
    name: 'tasks',
    component: () => import(/* webpackChunkName: "tasks" */ '../views/tasks.vue'),
    meta: { title: '任务管理' }
  },
  {
    path: '/stats',
    name: 'stats',
    component: () => import(/* webpackChunkName: "stats" */ '../views/stats.vue'),
    meta: { title: '统计' }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
