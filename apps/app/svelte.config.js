import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
export default {
    kit: {
        files: {
            assets: "public",
            hooks: "src/renderer/hooks",
            routes: "src/renderer/routes",
            template: "src/renderer/index.html"
        },
        adapter: adapter({

        })
    },
    preprocess: preprocess()
}