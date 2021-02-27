import {getHandlers as ipcHandlers, register} from "./ipc-handler";
import PresenceStatus from "./impl/presence-status";
register(new PresenceStatus());

export default function getHandlers() {
  return ipcHandlers();
}
