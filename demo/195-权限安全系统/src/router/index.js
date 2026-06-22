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
    path: '/roles',
    name: 'roles',
    component: () => import(/* webpackChunkName: "roles" */ '../views/roles.vue'),
    meta: { title: '角色管理' }
  },
  {
    path: '/permissions',
    name: 'permissions',
    component: () => import(/* webpackChunkName: "permissions" */ '../views/permissions.vue'),
    meta: { title: '权限管理' }
  },
  {
    path: '/logs',
    name: 'logs',
    component: () => import(/* webpackChunkName: "logs" */ '../views/logs.vue'),
    meta: { title: '日志' }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
