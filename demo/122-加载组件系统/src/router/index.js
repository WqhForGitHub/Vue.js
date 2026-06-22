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
    path: '/components/feedback',
    name: 'compFeedback',
    component: () => import(/* webpackChunkName: "compFeedback" */ '../views/compFeedback.vue'),
    meta: { title: 'Feedback 反馈' }
  },
  {
    path: '/components/skeleton',
    name: 'compSkeleton',
    component: () => import(/* webpackChunkName: "compSkeleton" */ '../views/compSkeleton.vue'),
    meta: { title: 'Skeleton 骨架屏' }
  },
  {
    path: '/demo',
    name: 'demo',
    component: () => import(/* webpackChunkName: "demo" */ '../views/demo.vue'),
    meta: { title: '示例' }
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
