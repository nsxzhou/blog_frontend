import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  model: {},
  initialState: {},
  request: {},
  routes: [
    // 公开页面
    {
      path: '/',
      component: '@/pages/home',
    },
    {
      path: '/blog',
      component: '@/pages/blog',
    },
    {
      path: '/about',
      component: '@/pages/about',
    },
    {
      path: '/article-detail/:id',
      component: '@/pages/article-detail',
    },
    {
      path: '/403',
      component: '@/pages/403',
    },

    // 仅未登录用户可访问
    {
      path: '/login',
      component: '@/pages/login',
    },
    {
      path: '/qq/callback',
      component: '@/pages/login/qq-callback',
    },

    // 需要登录的页面
    {
      path: '/profile',
      component: '@/pages/profile',
    },
    {
      path: '/notifications',
      component: '@/pages/notifications',
    },
    {
      path: '/reading-history',
      component: '@/pages/reading-history',
    },
    {
      path: '/favorites',
      component: '@/pages/favorites',
    },

    // 管理员专用页面
    {
      path: '/categories',
      component: '@/pages/categories',
    },
    {
      path: '/tags',
      component: '@/pages/tags',
    },
    {
      path: '/images',
      component: '@/pages/images',
    },
    {
      path: '/comments',
      component: '@/pages/comments',
    },
    {
      path: '/users',
      component: '@/pages/users',
    },
    {
      path: '/write',
      component: '@/pages/write',
    },
    {
      path: '/articles',
      component: '@/pages/articles',
    },
    {
      path: '/my-articles',
      component: '@/pages/my-articles',
    },
  ],
  npmClient: 'pnpm',
  dva: {},
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
    },
    '/uploads': {
      target: 'http://localhost:8080',
      changeOrigin: true,
    },
    '/api/ws': {
      target: 'ws://localhost:8080',
      changeOrigin: true,
      ws: true,
    },
  },
  tailwindcss: {},
  esbuildMinifyIIFE: true,
});
