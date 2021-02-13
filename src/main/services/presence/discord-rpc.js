const CLIENT_ID = '781044799716720680';

import RPC from "discord-rpc";

RPC.register(CLIENT_ID);

let statusToState = [
  "Idle",
  "Watching"
]

const client = new RPC.Client({ transport: 'ipc' });

export function start() {
  client.on('ready', () => {
    let startTimestamp = new Date();
    client.setActivity({
      state: statusToState[0],
      startTimestamp,
      largeImageKey: 'ganyu',
      largeImageText: 'Anime is cool',
      smallImageKey: 'ganyu',
      smallImageText: 'Aqil is nice to beat up',
      instance: false,
    })
  });

  client.login({
    clientId: CLIENT_ID
  });
}

export function updateActivity(statusData) {
  let statusText = statusToState[statusData.status];
  if (statusData.status === 1) {
    statusText = `${statusData.anime.title} Episode ${statusData.episode}`;
  }

  let activity = {
    details: "Watching Anime",
    state: statusText,
    largeImageKey: 'ganyu',
    largeImageText: "Enime",
    smallImageKey: statusData.paused ? 'pause' : 'play',
    smallImageText: statusData.paused ? 'Paused' : 'Watching',
    instance: false,
  };

  if (statusData.startTimestamp) activity.startTimestamp = statusData.startTimestamp;
  if (statusData.endTimestamp) activity.endTimestamp = statusData.endTimestamp;

  client.setActivity(activity)
}
