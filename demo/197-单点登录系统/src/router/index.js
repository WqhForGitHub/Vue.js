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
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '../views/login.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/auth',
    name: 'auth',
    component: () => import(/* webpackChunkName: "auth" */ '../views/auth.vue'),
    meta: { title: '鉴权' }
  },
  {
    path: '/users',
    name: 'userList',
    component: () => import(/* webpackChunkName: "userList" */ '../views/userList.vue'),
    meta: { title: '用户管理' }
  },
  {
    path: '/logs',
    name: 'logs',
    component: () => import(/* webpackChunkName: "logs" */ '../views/logs.vue'),
    meta: { title: '日志' }
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
