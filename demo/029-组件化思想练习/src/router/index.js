import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/home.vue'
import AboutView from '../views/about.vue'
import DemoView from '../views/demo.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { title: '首页' }
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView,
    meta: { title: '关于' }
  },
  {
    path: '/demo',
    name: 'demo',
    component: DemoView,
    meta: { title: '示例' }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
