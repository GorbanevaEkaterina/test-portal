import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  server: {
    open: true,
    port: 5173,
    proxy: {
      "/student/schedule-open": {
        target: "https://portal.psuti.ru",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path,
      },
    },
  },
  build: {
    outDir: "dist",
  },
});
