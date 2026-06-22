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
    path: '/components/nav',
    name: 'compNav',
    component: () => import(/* webpackChunkName: "compNav" */ '../views/compNav.vue'),
    meta: { title: 'Nav 导航' }
  },
  {
    path: '/components/tabs',
    name: 'compTabs',
    component: () => import(/* webpackChunkName: "compTabs" */ '../views/compTabs.vue'),
    meta: { title: 'Tabs 标签页' }
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
