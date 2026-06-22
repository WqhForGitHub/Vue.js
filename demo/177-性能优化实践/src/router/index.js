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
    path: '/stats',
    name: 'stats',
    component: () => import(/* webpackChunkName: "stats" */ '../views/stats.vue'),
    meta: { title: '统计' }
  },
  {
    path: '/monitor',
    name: 'monitor',
    component: () => import(/* webpackChunkName: "monitor" */ '../views/monitor.vue'),
    meta: { title: '监控' }
  },
  {
    path: '/reports',
    name: 'reports',
    component: () => import(/* webpackChunkName: "reports" */ '../views/reports.vue'),
    meta: { title: '报表' }
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
