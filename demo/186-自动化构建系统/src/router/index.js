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
    path: '/ci',
    name: 'ci',
    component: () => import(/* webpackChunkName: "ci" */ '../views/ci.vue'),
    meta: { title: 'CI/CD' }
  },
  {
    path: '/build',
    name: 'build',
    component: () => import(/* webpackChunkName: "build" */ '../views/build.vue'),
    meta: { title: '构建' }
  },
  {
    path: '/deploy',
    name: 'deploy',
    component: () => import(/* webpackChunkName: "deploy" */ '../views/deploy.vue'),
    meta: { title: '部署' }
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
