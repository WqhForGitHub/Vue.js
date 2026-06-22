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
    path: '/topics',
    name: 'topics',
    component: () => import(/* webpackChunkName: "topics" */ '../views/topics.vue'),
    meta: { title: '话题' }
  },
  {
    path: '/posts',
    name: 'posts',
    component: () => import(/* webpackChunkName: "posts" */ '../views/posts.vue'),
    meta: { title: '帖子管理' }
  },
  {
    path: '/messages',
    name: 'messages',
    component: () => import(/* webpackChunkName: "messages" */ '../views/messages.vue'),
    meta: { title: '消息' }
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import(/* webpackChunkName: "profile" */ '../views/profile.vue'),
    meta: { title: '个人中心' }
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
