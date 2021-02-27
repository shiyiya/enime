import _ from 'lodash';

const CLIENT_ID = '781044799716720680';

import RPC from "discord-rpc";
import Job from "../job";

export default class DiscordPresence extends Job {
  constructor(props) {
    super(props);
  }

  name() {
    return "Discord RPC";
  }

  cron() {
    return null;
  }

  run() {
    RPC.register(CLIENT_ID);

    let statusToState = [
      "Idle",
      "Watching"
    ]

    const store = global.store;

    let prevPresenceData = null;

    store.subscribe(() => {
      let data = store.getState()['current-presence'], state = data.state;

      if (!_.isEqual(prevPresenceData, data)) {
        let statusText = statusToState[state];
        switch (state) {
          case 1:
            statusText = `${data.player.anime.title} Episode ${data.player.anime.episode}`;
            break;
          default:
            break;
        }

        let activity = {
          details: "Watching Anime",
          state: statusText,
          largeImageKey: 'ganyu',
          largeImageText: "Enime",
          smallImageKey: data.player.paused ? 'pause' : 'play',
          smallImageText: data.player.paused ? 'Paused' : 'Watching',
          instance: false,
        };

        if (data.startTimestamp) activity.startTimestamp = data.startTimestamp;
        if (data.endTimestamp) activity.endTimestamp = data.endTimestamp;

        client.setActivity(activity)

        prevPresenceData = data;
      }
    })

    const client = new RPC.Client({ transport: 'ipc' });

    client.on('ready', () => {
      let startTimestamp = new Date();
      client.setActivity({
        state: statusToState[0],
        startTimestamp,
        largeImageKey: 'ganyu',
        largeImageText: 'Life is anime',
        smallImageKey: 'ganyu',
        smallImageText: 'Enime v0.01-DEV',
        instance: false,
      })
    });

    client.login({
      clientId: CLIENT_ID
    });
  }
}
