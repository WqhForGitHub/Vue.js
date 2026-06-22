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
    path: '/coupons',
    name: 'coupons',
    component: () => import(/* webpackChunkName: "coupons" */ '../views/coupons.vue'),
    meta: { title: '优惠券' }
  },
  {
    path: '/orders',
    name: 'orders',
    component: () => import(/* webpackChunkName: "orders" */ '../views/orders.vue'),
    meta: { title: '订单管理' }
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
