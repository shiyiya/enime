import _ from 'lodash';

const CLIENT_ID = '781044799716720680';

import RPC from "discord-rpc";
import Job from "../job";

import PresenceConstants from "../../../../shared/presence/presence-constants";
import PresenceState from "../../../../shared/presence/presence-state";

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

  async run() {
    RPC.register(CLIENT_ID);

    const store = global.store, subfun = () => {
      let data = store.getState()['current-presence'], { state } = data;

      if (data && !_.isEqual(prevPresenceData, data)) {
        let statusText = PresenceConstants.STATUS_TO_STATE[state];
        switch (state) {
          case PresenceState.WATCHING_ANIME:
            statusText = `${data.player.anime.title} Episode ${data.player.anime.episode}`;
            break;
        }

        let activity = {
          details: PresenceConstants.STATUS_TO_STATE[state],
          state: statusText,
          largeImageKey: PresenceConstants.IMAGE_KEY,
          largeImageText: PresenceConstants.LARGE_TEXT,
          ...(state === PresenceState.WATCHING_ANIME && { smallImageKey: !data.player.paused ? PresenceConstants.PLAYER_ICON_PAUSE : PresenceConstants.PLAYER_ICON_PLAY } ),
          smallImageText: state === PresenceState.WATCHING_ANIME ? (data.player.paused ? PresenceConstants.PLAYER_PAUSED : PresenceConstants.PLAYER_WATCHING) : PresenceConstants.SMALL_TEXT,
          instance: false,
        };

        if (state === PresenceState.WATCHING_ANIME) {
          if (data.startTimestamp) activity.startTimestamp = data.startTimestamp;
          if (data.endTimestamp) activity.endTimestamp = data.endTimestamp;
        }

        client.setActivity(activity)

        prevPresenceData = data;
      }
    };

    let prevPresenceData, unsub = store.subscribe(subfun), lastval = true;

    global.events.on('rpc', val => {
      if(val === lastval) return;
      lastval = val;
      if(val) { unsub = store.subscribe(subfun); connectv2(); }
      else { unsub(); client.destroy(); }
    })

    let client;
    const connectv2 = async function() {
      client = new RPC.Client({ transport: 'ipc' });
      client.on('ready', () => {
        let startTimestamp = new Date();
        client.setActivity({
          state: PresenceConstants.STATUS_TO_STATE[PresenceState.IDLE],
          startTimestamp,
          largeImageKey: PresenceConstants.IMAGE_KEY,
          largeImageText: PresenceConstants.LARGE_TEXT,
          smallImageText: PresenceConstants.SMALL_TEXT,
          instance: false,
        })
      });

      try {
        await client.login({
          clientId: CLIENT_ID
        });
      } catch(err) { console.log(err); }
    }
    connectv2();
  }
}
