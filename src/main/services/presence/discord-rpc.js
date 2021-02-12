const CLIENT_ID = '781044799716720680';

import RPC from "discord-rpc";

RPC.register(CLIENT_ID);

export function start() {
  const client = new RPC.Client({ transport: 'ipc' });

  client.on('ready', () => {
    let startTimestamp = new Date();
    client.setActivity({
      details: "Watching Enime",
      state: 'Beating up Aqil',
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
