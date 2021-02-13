import IpcHandler from "../ipc-handler";
import torrenStream from "../../stream/torrent/stream-torrent";

export default class RecentReleases extends IpcHandler {
  constructor(props) {
    super(props);
  }

  name() {
    return "Recent Releases";
  }

  channel() {
    return "enime:stream-torrent";
  }

  async handle(event, data) {
    return torrenStream(data);
  }
}
