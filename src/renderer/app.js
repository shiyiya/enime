import bridge from './bridge';
import Events from '../common/types/events';
import { DiscordPresenceUpdateEvent } from '../common/events/discord-presence-update';
import { PresenceStatus } from '../common/types/status';

import App from './App.svelte';

const app = new App({
  target: document.body
});

export default app;
