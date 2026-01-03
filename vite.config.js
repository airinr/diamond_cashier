import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://diamond.rutherweb.my.id",
        changeOrigin: true,
        secure: true, // kalau SSL valid. kalau bermasalah, coba false
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
