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
    path: '/components/table',
    name: 'compTable',
    component: () => import(/* webpackChunkName: "compTable" */ '../views/compTable.vue'),
    meta: { title: 'Table 表格' }
  },
  {
    path: '/components/pagination',
    name: 'compPagination',
    component: () => import(/* webpackChunkName: "compPagination" */ '../views/compPagination.vue'),
    meta: { title: 'Pagination 分页' }
  },
  {
    path: '/demo',
    name: 'demo',
    component: () => import(/* webpackChunkName: "demo" */ '../views/demo.vue'),
    meta: { title: '示例' }
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import(/* webpackChunkName: "settings" */ '../views/settings.vue'),
    meta: { title: '设置' }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
