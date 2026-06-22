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
    path: '/deploy',
    name: 'deploy',
    component: () => import(/* webpackChunkName: "deploy" */ '../views/deploy.vue'),
    meta: { title: '部署' }
  },
  {
    path: '/build',
    name: 'build',
    component: () => import(/* webpackChunkName: "build" */ '../views/build.vue'),
    meta: { title: '构建' }
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import(/* webpackChunkName: "settings" */ '../views/settings.vue'),
    meta: { title: '设置' }
  },
  {
    path: '/docs',
    name: 'docs',
    component: () => import(/* webpackChunkName: "docs" */ '../views/docs.vue'),
    meta: { title: '文档' }
  },
  {
    path: '/about',
    name: 'about',
    component: () => import(/* webpackChunkName: "about" */ '../views/about.vue'),
    meta: { title: '关于' }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
