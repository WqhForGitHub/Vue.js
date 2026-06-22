import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/home.vue'
import AboutView from '../views/about.vue'
import PracticeView from '../views/practice.vue'

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
    path: '/practice',
    name: 'practice',
    component: PracticeView,
    meta: { title: '练习' }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
