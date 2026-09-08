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
    path: '/components/input',
    name: 'compInput',
    component: () => import(/* webpackChunkName: "compInput" */ '../views/compInput.vue'),
    meta: { title: 'Input 输入框' },
  },
  {
    path: '/components/form',
    name: 'compForm',
    component: () => import(/* webpackChunkName: "compForm" */ '../views/compForm.vue'),
    meta: { title: 'Form 表单' },
  },
  {
    path: '/components/dialog',
    name: 'compDialog',
    component: () => import(/* webpackChunkName: "compDialog" */ '../views/compDialog.vue'),
    meta: { title: 'Dialog 弹窗' },
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import(/* webpackChunkName: "settings" */ '../views/settings.vue'),
    meta: { title: '设置' },
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
