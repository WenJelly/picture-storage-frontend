import type { RouteRecordRaw } from 'vue-router'
import { h } from 'vue'
import { HomeOutlined } from '@ant-design/icons'
import HomePage from '@/pages/HomePage.vue'
import UserRegisterPage from '@/pages/user/UserRegisterPage.vue'
import UserLoginPage from '@/pages/user/UserLoginPage.vue'
import ACCESS_ENUM from '@/assets/accessEnum.ts'

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: '主页',
    component: HomePage,
    meta: {
      show: true,
      icon: () => h(HomeOutlined),
    },
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../pages/HomePage.vue'), // 使用import按需懒加载组件，提升性能
    meta: {
      authCheck: ACCESS_ENUM.USER,
    },
  },
  {
    path: '/user/admin/manage',
    name: '用户管理',
    component: () => import('../pages/admin/AdminManagePage.vue'),
    meta: {
      // authCheck: ACCESS_ENUM.ADMIN,
    },
  },
  {
    path: '/user',
    name: '用户模块',
    children: [
      {
        path: '/user/login',
        name: '用户登陆',
        component: UserLoginPage,
      },
      {
        path: '/user/register',
        name: '用户注册',
        component: UserRegisterPage,
      },
    ],
    meta: {
      show: false,
    },
  },
]
