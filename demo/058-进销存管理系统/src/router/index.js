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
    path: '/purchase',
    name: 'purchase',
    component: () => import(/* webpackChunkName: "purchase" */ '../views/purchase.vue'),
    meta: { title: '采购管理' }
  },
  {
    path: '/sales',
    name: 'sales',
    component: () => import(/* webpackChunkName: "sales" */ '../views/sales.vue'),
    meta: { title: '销售管理' }
  },
  {
    path: '/inventory',
    name: 'inventory',
    component: () => import(/* webpackChunkName: "inventory" */ '../views/inventory.vue'),
    meta: { title: '库存管理' }
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
