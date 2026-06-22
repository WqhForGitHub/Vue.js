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
    path: '/components/button',
    name: 'compButton',
    component: () => import(/* webpackChunkName: "compButton" */ '../views/compButton.vue'),
    meta: { title: 'Button 按钮' }
  },
  {
    path: '/components/input',
    name: 'compInput',
    component: () => import(/* webpackChunkName: "compInput" */ '../views/compInput.vue'),
    meta: { title: 'Input 输入框' }
  },
  {
    path: '/components/dialog',
    name: 'compDialog',
    component: () => import(/* webpackChunkName: "compDialog" */ '../views/compDialog.vue'),
    meta: { title: 'Dialog 弹窗' }
  },
  {
    path: '/components/feedback',
    name: 'compFeedback',
    component: () => import(/* webpackChunkName: "compFeedback" */ '../views/compFeedback.vue'),
    meta: { title: 'Feedback 反馈' }
  },
  {
    path: '/mine',
    name: 'mine',
    component: () => import(/* webpackChunkName: "mine" */ '../views/mine.vue'),
    meta: { title: '我的' }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
