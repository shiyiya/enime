<script>
  import MPV from './mpv/mpv';
  import { onMount } from 'svelte';

  let paused = false;
  let mpv;

  onMount(() => {
    mpv = new MPV(document.getElementById('player'), () => {
      mpv.property('hwdec', 'auto');
      mpv.command('loadfile', 'https://filesamples.com/samples/video/mkv/sample_1280x720_surfing_with_audio.mkv');

      mpv.property('pause', true);
    });
  });
</script>
<div id="player"></div>

