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
    path: '/performance',
    name: 'performance',
    component: () => import(/* webpackChunkName: "performance" */ '../views/performance.vue'),
    meta: { title: '性能' }
  },
  {
    path: '/components/button',
    name: 'compButton',
    component: () => import(/* webpackChunkName: "compButton" */ '../views/compButton.vue'),
    meta: { title: 'Button 按钮' }
  },
  {
    path: '/components/table',
    name: 'compTable',
    component: () => import(/* webpackChunkName: "compTable" */ '../views/compTable.vue'),
    meta: { title: 'Table 表格' }
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import(/* webpackChunkName: "settings" */ '../views/settings.vue'),
    meta: { title: '设置' }
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
