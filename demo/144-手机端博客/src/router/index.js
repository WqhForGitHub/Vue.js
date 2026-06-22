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
    path: '/articles',
    name: 'articles',
    component: () => import(/* webpackChunkName: "articles" */ '../views/articles.vue'),
    meta: { title: '文章管理' }
  },
  {
    path: '/articles/:id',
    name: 'articleDetail',
    component: () => import(/* webpackChunkName: "articleDetail" */ '../views/articleDetail.vue'),
    meta: { title: '文章详情' }
  },
  {
    path: '/articles/edit',
    name: 'articleEdit',
    component: () => import(/* webpackChunkName: "articleEdit" */ '../views/articleEdit.vue'),
    meta: { title: '编辑文章' }
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
