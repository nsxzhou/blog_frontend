import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  model: {},
  initialState: {},
  request: {},
  routes: [
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
      path: '/my-articles',
      component: '@/pages/my-articles',
    },
    // {
    //   path: '/rss',
    //   component: '@/pages/rss',
    // },
    {
      path: '/articles',
      component: '@/pages/articles',
    },
    {
      path: '/reading-history',
      component: '@/pages/reading-history',
    },
    {
      path: '/login',
      component: '@/pages/login',
    },
    {
      path: '/qq/callback',
      component: '@/pages/login/qq-callback',
    },
    {
      path: '/write',
      component: '@/pages/write',
    },
    {
      path: '/article-detail/:id',
      component: '@/pages/article-detail',
    },
    {
      path: '/profile',
      component: '@/pages/profile',
    },
    {
      path: '/notifications',
      component: '@/pages/notifications',
    },
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
      path: '/favorites',
      component: '@/pages/favorites',
    },
    {
      path: '/403',
      component: '@/pages/403',
    }
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
  },
  tailwindcss: {},
  esbuildMinifyIIFE: true,
});
