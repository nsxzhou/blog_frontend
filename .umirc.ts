import { defineConfig } from "@umijs/max";

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
      path: '/article-detail/:id',
      component: '@/pages/article-detail',
    },
    {
      path: '/about',
      component: '@/pages/about',
    },
    {
      path: '/my-articles',
      component: '@/pages/my-articles',
    },
  ],
  npmClient: "pnpm",
  dva: {},
  proxy: {
    "/api": {
      target: "http://localhost:8888",
      changeOrigin: true,
    },
  },
  tailwindcss: {},
  esbuildMinifyIIFE: true,
});
