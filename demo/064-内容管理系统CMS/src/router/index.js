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
    path: '/categories',
    name: 'categories',
    component: () => import(/* webpackChunkName: "categories" */ '../views/categories.vue'),
    meta: { title: '分类管理' }
  },
  {
    path: '/comments',
    name: 'comments',
    component: () => import(/* webpackChunkName: "comments" */ '../views/comments.vue'),
    meta: { title: '评论管理' }
  },
  {
    path: '/users',
    name: 'userList',
    component: () => import(/* webpackChunkName: "userList" */ '../views/userList.vue'),
    meta: { title: '用户管理' }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
