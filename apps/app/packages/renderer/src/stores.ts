import { Writable, writable } from 'svelte/store';

export const releases: Writable<AnimeRelease[]> = writable([]);