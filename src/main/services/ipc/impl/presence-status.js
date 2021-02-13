import IpcHandler from "../ipc-handler";
import { updateActivity } from "../../presence/discord-rpc";

export default class PresenceStatus extends IpcHandler {
  constructor(props) {
    super(props);
  }

  name() {
    return "Discord Presence Activity";
  }

  channel() {
    return "enime:presence-status";
  }

  async handle(event, data) {
    updateActivity({
      status: data.status,
      anime: {
        title: data.anime.title.primary
      },
      episode: data.episode,
      startTimestamp: data.startTimestamp,
      endTimestamp: data.endTimestamp,
      paused: data.paused
    })

    return null;
  }
}
