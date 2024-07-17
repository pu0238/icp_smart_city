import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import EnvironmentPlugin from "vite-plugin-environment";
import path from "path";
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import { fileURLToPath } from "url";

process.env = {
  ...process.env,
  ...loadEnv(process.env.NODE_ENV, path.resolve(process.cwd(), "../../"), ""),
};

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  build: {
    emptyOutDir: true,
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
  plugins: [EnvironmentPlugin(["CANISTER_ID_SMART_CITY_BACKEND", "DFX_NETWORK"]), vue()],

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },
  resolve: {
    alias: {
      assert: "assert/",
      crypto: "crypto-browserify/",
      buffer: "buffer/",
      events: "events/",
      stream: "stream-browserify/",
      util: "util/",
    },
  },
  define: {
    'process.browser': true
  }
}));
