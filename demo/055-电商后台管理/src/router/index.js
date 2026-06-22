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
    path: '/products',
    name: 'products',
    component: () => import(/* webpackChunkName: "products" */ '../views/products.vue'),
    meta: { title: '商品列表' }
  },
  {
    path: '/orders',
    name: 'orders',
    component: () => import(/* webpackChunkName: "orders" */ '../views/orders.vue'),
    meta: { title: '订单管理' }
  },
  {
    path: '/users',
    name: 'userList',
    component: () => import(/* webpackChunkName: "userList" */ '../views/userList.vue'),
    meta: { title: '用户管理' }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
