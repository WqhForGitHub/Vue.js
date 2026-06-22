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
    path: '/orders',
    name: 'orders',
    component: () => import(/* webpackChunkName: "orders" */ '../views/orders.vue'),
    meta: { title: '订单管理' }
  },
  {
    path: '/orders/:id',
    name: 'orderDetail',
    component: () => import(/* webpackChunkName: "orderDetail" */ '../views/orderDetail.vue'),
    meta: { title: '订单详情' }
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
