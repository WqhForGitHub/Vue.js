import Vue from 'vue';
import VueRouter from 'vue-router';
import HomeView from '../views/home.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { title: '首页' },
  },
  {
    path: '/platform',
    name: 'platform',
    component: () => import(/* webpackChunkName: "platform" */ '../views/platform.vue'),
    meta: { title: '平台' },
  },
  {
    path: '/engineering',
    name: 'engineering',
    component: () => import(/* webpackChunkName: "engineering" */ '../views/engineering.vue'),
    meta: { title: '工程化' },
  },
  {
    path: '/docs',
    name: 'docs',
    component: () => import(/* webpackChunkName: "docs" */ '../views/docs.vue'),
    meta: { title: '文档' },
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import(/* webpackChunkName: "settings" */ '../views/settings.vue'),
    meta: { title: '设置' },
  },
  {
    path: '/about',
    name: 'about',
    component: () => import(/* webpackChunkName: "about" */ '../views/about.vue'),
    meta: { title: '关于' },
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
