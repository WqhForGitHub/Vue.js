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
    path: '/tasks',
    name: 'tasks',
    component: () => import(/* webpackChunkName: "tasks" */ '../views/tasks.vue'),
    meta: { title: '任务管理' }
  },
  {
    path: '/workflow',
    name: 'workflow',
    component: () => import(/* webpackChunkName: "workflow" */ '../views/workflow.vue'),
    meta: { title: '工作流' }
  },
  {
    path: '/logs',
    name: 'logs',
    component: () => import(/* webpackChunkName: "logs" */ '../views/logs.vue'),
    meta: { title: '日志' }
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
