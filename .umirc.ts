import { defineConfig } from "@umijs/max";

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  routes: [],
  npmClient: "pnpm",
  dva: {},
  proxy: {
    "/api": {
      target: "http://localhost:8888",
      changeOrigin: true,
    },
  },
  tailwindcss: {},
});
