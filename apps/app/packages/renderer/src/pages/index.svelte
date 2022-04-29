<script lang="ts">
    import { link } from 'svelte-spa-router';
    import VideoPlayer from '../component/player/index.svelte';
    import { onMount } from 'svelte';

    let player;

    function ready() {
        //player.pause();
    }

    function on(event) {
        const { property, value } = event.detail;

        console.log(property, value)
    }
</script>
<VideoPlayer bind:this={player} on:ready={ready} properties={["time-pos"]} on:change={on} src="http://localhost:10000" autoplay/>

<h1>Main Page</h1>
