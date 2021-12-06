import { build } from 'esbuild';
import babel from 'esbuild-plugin-babel';

export async function esbuildTranspiler(sourceFilePath, buildFilePath) {
    await build({
        platform: 'node',
        target: 'node14',
        bundle: false,
        sourcemap: false,
        plugins: [babel()],
        entryPoints: [sourceFilePath],
        outfile: buildFilePath,
        format: 'cjs'
    })
}
