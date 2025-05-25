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
      path: '/about',
      component: '@/pages/about',
    }
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
