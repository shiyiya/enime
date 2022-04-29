<script lang="ts">
    export let src: string;
    export let autoplay: boolean = false;
    export let properties: string[] = [];

    import { createEventDispatcher, onMount } from 'svelte';

    let player;

    function postData(type: string, data) {
        if (player) player.postMessage({ type, data });
    }

    export function command(type: string, ...args) {
        args = args.map(arg => arg.toString());
        postData("command", [type].concat(args));
    }

    export function observe(name: string) {
        postData("observe_property", name);
    }

    export function property(name, value) {
        const data = { name, value };
        postData("set_property", data);
    }

    export function keypress(key: string) {
        command("keypress", key);
    }

    export function volume(volume: number) {
        property("volume", volume);
    }

    export function play() {
        property("pause", false);
    }

    export function pause() {
        property("pause", true);
    }

    export function position(position: number) {
        property("time-pos", position);
    }

    export function replay() {
        position(0);
        play();
    }

    export function destroy() {
        pause();
        command("stop");
        if (player) player.remove();
    }

    const dispatch = createEventDispatcher();

    onMount(() => {
        player.addEventListener("message", (event) => {
            let type = event.data.type;

            if (type === "ready") {
                if (autoplay) play();
                command("loadfile", src);

                dispatch("ready");
                properties.forEach(property => observe(property));
            } else if (type === "property_change") {
                const property = event.data.data.name;

                if (properties.includes(property)) {
                    dispatch("change", {
                        property: property,
                        ...(event.data.data.value && {
                            value: event.data.data.value
                        })
                    })
                }
            }
        });
    });
</script>

<embed bind:this={player} type="application/x-mpvjs" id="player"/>