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
    path: '/components/table',
    name: 'compTable',
    component: () => import(/* webpackChunkName: "compTable" */ '../views/compTable.vue'),
    meta: { title: 'Table 表格' }
  },
  {
    path: '/components/dialog',
    name: 'compDialog',
    component: () => import(/* webpackChunkName: "compDialog" */ '../views/compDialog.vue'),
    meta: { title: 'Dialog 弹窗' }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
