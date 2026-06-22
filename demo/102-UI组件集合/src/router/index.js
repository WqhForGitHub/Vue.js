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
    path: '/components/form',
    name: 'compForm',
    component: () => import(/* webpackChunkName: "compForm" */ '../views/compForm.vue'),
    meta: { title: 'Form 表单' }
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
  },
  {
    path: '/components/chart',
    name: 'compChart',
    component: () => import(/* webpackChunkName: "compChart" */ '../views/compChart.vue'),
    meta: { title: 'Chart 图表' }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
