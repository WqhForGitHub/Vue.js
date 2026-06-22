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
    path: '/question-bank',
    name: 'questionBank',
    component: () => import(/* webpackChunkName: "questionBank" */ '../views/questionBank.vue'),
    meta: { title: '题库' }
  },
  {
    path: '/exams',
    name: 'exams',
    component: () => import(/* webpackChunkName: "exams" */ '../views/exams.vue'),
    meta: { title: '考试管理' }
  },
  {
    path: '/results',
    name: 'results',
    component: () => import(/* webpackChunkName: "results" */ '../views/results.vue'),
    meta: { title: '成绩' }
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
