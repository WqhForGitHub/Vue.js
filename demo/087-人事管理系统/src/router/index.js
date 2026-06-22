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
    path: '/employees',
    name: 'employees',
    component: () => import(/* webpackChunkName: "employees" */ '../views/employees.vue'),
    meta: { title: '员工管理' }
  },
  {
    path: '/departments',
    name: 'departments',
    component: () => import(/* webpackChunkName: "departments" */ '../views/departments.vue'),
    meta: { title: '部门管理' }
  },
  {
    path: '/attendance',
    name: 'attendance',
    component: () => import(/* webpackChunkName: "attendance" */ '../views/attendance.vue'),
    meta: { title: '考勤管理' }
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
