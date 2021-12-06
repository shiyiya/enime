import { BuildWatcher } from './build-watcher.mjs';
import { esbuildTranspiler } from './transpiler.mjs';

new BuildWatcher(esbuildTranspiler).start();
