import path from 'path';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';

const PACKAGE_ROOT = __dirname;

export default {
    mode: process.env.MODE,
    root: PACKAGE_ROOT,
    resolve: {
        alias: {
            "/@/": path.join(PACKAGE_ROOT, "src") + "/",
            "readable-stream": "vite-compatible-readable-stream"
        },
    },
    plugins: [svelte({
        preprocess: [sveltePreprocess({ typescript: true })]
    }), typescript()],
    base: "",
    server: {
        fs: {
            strict: true,
        }
    },
    optimizeDeps: {
      exclude: ["@roxi/routify"]
    },
    build: {
        sourcemap: true,
        target: "chrome100",
        outDir: "dist",
        assetsDir: "../public",
        rollupOptions: {
            input: path.join(PACKAGE_ROOT, "index.html"),
            external: [],
        },
        emptyOutDir: true,
        brotliSize: false,
    },
    test: {
        environment: "happy-dom",
    }
}