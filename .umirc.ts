import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
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
    {
      path: '/login',
      component: '@/pages/login',
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
  ],
  npmClient: 'pnpm',
  dva: {},
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
    },
  },
  tailwindcss: {},
  esbuildMinifyIIFE: true,
});
