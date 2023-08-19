import path from "path";
import { defineConfig } from "vite";
import renderer from "vite-plugin-electron-renderer";

// https://vitejs.dev/config
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  plugins: [renderer({})],
});
