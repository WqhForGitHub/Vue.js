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
    path: '/charts',
    name: 'charts',
    component: () => import(/* webpackChunkName: "charts" */ '../views/charts.vue'),
    meta: { title: '图表' }
  },
  {
    path: '/reports',
    name: 'reports',
    component: () => import(/* webpackChunkName: "reports" */ '../views/reports.vue'),
    meta: { title: '报表' }
  },
  {
    path: '/analytics',
    name: 'analytics',
    component: () => import(/* webpackChunkName: "analytics" */ '../views/analytics.vue'),
    meta: { title: '分析' }
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
