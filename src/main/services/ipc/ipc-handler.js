export default class IpcHandler {
  constructor(props) {
    if (new.target === IpcHandler) {
      throw new TypeError("Cannot construct Abstract instances directly");
    }
  }

  name() {
    throw Error("The handler name cannot be null");
  }

  channel() {
    throw Error("The channel names need an implementation");
  }

  async handle(channel, event, data) {
    return null;
  }
}
const handlers = {};

export function getHandlers() {
  return handlers;
}

export function register(handler) {
  handlers[handler.channel()] = handler.handle;
}
