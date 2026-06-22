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
    path: '/inventory',
    name: 'inventory',
    component: () => import(/* webpackChunkName: "inventory" */ '../views/inventory.vue'),
    meta: { title: '库存管理' }
  },
  {
    path: '/warehouse',
    name: 'warehouse',
    component: () => import(/* webpackChunkName: "warehouse" */ '../views/warehouse.vue'),
    meta: { title: '仓库管理' }
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
