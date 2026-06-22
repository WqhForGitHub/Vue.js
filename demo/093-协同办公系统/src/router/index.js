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
    path: '/docs',
    name: 'docs',
    component: () => import(/* webpackChunkName: "docs" */ '../views/docs.vue'),
    meta: { title: '文档' }
  },
  {
    path: '/tasks',
    name: 'tasks',
    component: () => import(/* webpackChunkName: "tasks" */ '../views/tasks.vue'),
    meta: { title: '任务管理' }
  },
  {
    path: '/messages',
    name: 'messages',
    component: () => import(/* webpackChunkName: "messages" */ '../views/messages.vue'),
    meta: { title: '消息' }
  },
  {
    path: '/employees',
    name: 'employees',
    component: () => import(/* webpackChunkName: "employees" */ '../views/employees.vue'),
    meta: { title: '员工管理' }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
