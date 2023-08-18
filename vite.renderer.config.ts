import { defineConfig } from "vite";
import renderer from "vite-plugin-electron-renderer";

// https://vitejs.dev/config
export default defineConfig({
  plugins: [renderer({})],
});
