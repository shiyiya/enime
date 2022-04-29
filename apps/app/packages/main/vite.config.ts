import path from 'path';
import commonjsExternalsPlugin from 'vite-plugin-commonjs-externals';
import { builtinModules } from 'module';

const PACKAGE_ROOT = __dirname;

export default {
    mode: process.env.MODE,
    root: PACKAGE_ROOT,
    envDir: process.cwd(),
    resolve: {
        alias: {
            "/@/": path.join(PACKAGE_ROOT, "src") + "/",
        },
    },
    plugins: [commonjsExternalsPlugin({
        externals: ["path", "torrent-stream", "parse-torrent"]
    })],
    build: {
        sourcemap: "inline",
        target:  "node16",
        outDir: "dist",
        assetsDir: "../../public",
        minify: process.env.MODE !== "development",
        lib: {
            entry: "src/index.ts",
            formats: ["cjs"],
        },
        rollupOptions: {
            external: [
                "electron",
                "electron-devtools-installer",
                ...builtinModules.flatMap(p => [p, `node:${p}`]),
            ],
            output: {
                entryFileNames: "[name].cjs",
            },
        },
        emptyOutDir: true,
        brotliSize: false,
    }
}